import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    // Safely parse the URL
    let url;
    try {
      // If request.url is just a path, prepend with base URL
      if (request.url.startsWith('/')) {
        const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';
        url = new URL(request.url, baseUrl);
      } else {
        url = new URL(request.url);
      }
    } catch (error) {
      console.error('URL parsing error:', error);
      return NextResponse.json(
        { error: 'Invalid request URL' },
        { status: 400 }
      );
    }

    const sessionId = url.searchParams.get('sessionId')

    let where = {}

    if (session?.user?.id) {
      where.userId = session.user.id
    } else if (sessionId) {
      where.sessionId = sessionId
    } else {
      return NextResponse.json({ items: [], total: 0 })
    }

    const cartItems = await prisma.cart.findMany({
      where,
      include: {
        product: {
          include: {
            brand: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              },
              take: 1
            }
          }
        }
      }
    })

    const total = cartItems.reduce((sum, item) => {
      const price = item.product.discountedPrice > 0 ? item.product.discountedPrice : item.product.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      items: cartItems,
      total,
      count: cartItems.length
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { productId, quantity = 1, attributes, sessionId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product || product.status !== 1) {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 400 }
      )
    }

    // Check stock
    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    let cartData = {
      productId,
      quantity
    }

    if (session?.user?.id) {
      cartData.userId = session.user.id
    } else if (sessionId) {
      cartData.sessionId = sessionId
    } else {
      return NextResponse.json(
        { error: 'Session required' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    let existingWhere = { productId }
    if (session?.user?.id) {
      existingWhere.userId = session.user.id
    } else if (sessionId) {
      existingWhere.sessionId = sessionId
    }

    const existingItem = await prisma.cart.findFirst({
      where: existingWhere
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              brand: true,
              images: {
                orderBy: {
                  sortOrder: 'asc'
                },
                take: 1
              }
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cart.create({
        data: cartData,
        include: {
          product: {
            include: {
              brand: true,
              images: {
                orderBy: {
                  sortOrder: 'asc'
                },
                take: 1
              }
            }
          }
        }
      })
    }

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}
