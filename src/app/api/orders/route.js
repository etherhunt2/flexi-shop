import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    let where = {
      userId: session.user.id // Using UUID directly
    }

    if (status !== null && status !== undefined) {
      where.status = parseInt(status)
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderDetails: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: {
                    where: {
                      assignProductAttributeId: 0
                    },
                    take: 1
                  }
                }
              }
            }
          },
          appliedCoupon: {
            include: {
              coupon: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethodId,
      couponCode,
      paymentMethod
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    let shippingCharge = 0
    let couponDiscount = 0

    // Validate items and calculate subtotal
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product || product.status !== 1) {
        return NextResponse.json(
          { error: `Product ${item.productId} not available` },
          { status: 400 }
        )
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        )
      }

      const price = product.discountedPrice || product.price
      subtotal += price * item.quantity
    }

    // Get shipping method
    if (shippingMethodId) {
      const shippingMethod = await prisma.shippingMethod.findUnique({
        where: { id: shippingMethodId }
      })
      if (shippingMethod) {
        shippingCharge = shippingMethod.charge
      }
    }

    // Apply coupon if provided
    let appliedCoupon = null
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      })

      if (coupon && coupon.status === 1 &&
        new Date() >= coupon.startDate &&
        new Date() <= coupon.endDate &&
        coupon.used < coupon.usageLimit) {

        if (subtotal >= coupon.minimumAmount) {
          if (coupon.type === 1) { // percentage
            couponDiscount = (subtotal * coupon.discount) / 100
            if (coupon.maximumAmount > 0) {
              couponDiscount = Math.min(couponDiscount, coupon.maximumAmount)
            }
          } else { // fixed
            couponDiscount = coupon.discount
          }
          appliedCoupon = coupon
        }
      }
    }

    const totalAmount = subtotal + shippingCharge - couponDiscount

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id, // Using UUID directly
          orderNumber,
          totalAmount,
          shippingCharge,
          couponDiscount,
          deliveryAddress: shippingAddress,
          billingAddress,
          status: 0, // pending
          paymentStatus: 0 // pending
        }
      })

      // Create order details
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        })

        const price = product.discountedPrice || product.price

        await tx.orderDetail.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price * item.quantity,
            productInfo: {
              name: product.name,
              image: product.mainImage,
              attributes: item.attributes
            }
          }
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity }
          }
        })
      }

      // Apply coupon if used
      if (appliedCoupon) {
        await tx.appliedCoupon.create({
          data: {
            userId: session.user.id, // Using UUID directly
            orderId: newOrder.id,
            couponId: appliedCoupon.id,
            discount: couponDiscount
          }
        })

        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { used: { increment: 1 } }
        })
      }

      // Remove the cart cleanup from transaction to handle it separately

      return newOrder
    })

    // Clear cart after successful order creation
    try {
      // Using the dedicated cart clear endpoint
      const cartClearResponse = await fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('cookie') || ''
        }
      })

      if (!cartClearResponse.ok) {
        console.error('Failed to clear cart:', await cartClearResponse.text())
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      // Don't throw error here as order is already created successfully
    }

    // Get complete order with details
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderDetails: {
          include: {
            product: {
              include: {
                brand: true,
                images: {
                  where: {
                    assignProductAttributeId: 0
                  },
                  take: 1
                }
              }
            }
          }
        },
        appliedCoupon: {
          include: {
            coupon: true
          }
        }
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
