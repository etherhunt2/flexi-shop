import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidObjectId } from '@/lib/mongodb-utils'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Validate required fields
    if (!data.name || !data.price || !data.brandId || !data.categoryIds?.length) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, brand, and categories' 
      }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update the product
      const updatedProduct = await tx.product.update({
        where: { id: id },
        data: {
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          price: data.price,
          discountedPrice: data.discountedPrice,
          short_description: data.summary,
          description: data.description,
          brandId: data.brandId,
          is_featured: data.isFeatured ? 1 : 0,
          is_slider: data.isSlider ? 1 : 0,
          status: data.status || 1,
          digital_item: data.digitalItem ? 1 : 0,
          specification: data.specification || {},
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords ? data.metaKeywords.split(',').map(k => k.trim()) : [],
          main_image: data.mainImage || '/placeholder-product.svg'
        }
      })

      // Update categories
      await tx.product.update({
        where: { id: id },
        data: {
          categories: {
            set: data.categoryIds.map(id => ({ id: id }))
          }
        }
      })

      // Update stock if quantity provided
      if (data.quantity !== undefined) {
        const existingStock = await tx.productStock.findFirst({
          where: { productId: id }
        })

        if (existingStock) {
          await tx.productStock.update({
            where: { id: existingStock.id },
            data: {
              quantity: data.quantity,
              price: data.price
            }
          })
        } else if (data.quantity > 0) {
          await tx.productStock.create({
            data: {
              productId: id,
              quantity: data.quantity,
              price: data.price
            }
          })
        }
      }

      return updatedProduct
    })

    return NextResponse.json({ 
      message: 'Product updated successfully', 
      product 
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        orderDetails: {
          select: { id: true }
        },
        carts: {
          select: { id: true }
        },
        wishlists: {
          select: { id: true }
        }
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if product has orders, carts, or wishlists
    if (existingProduct.orderDetails.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product that has been ordered' 
      }, { status: 400 })
    }

    if (existingProduct.carts.length > 0 || existingProduct.wishlists.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product that is in carts or wishlists' 
      }, { status: 400 })
    }

    // Delete product with transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.productStock.deleteMany({
        where: { productId: id }
      })

      await tx.productImage.deleteMany({
        where: { productId: id }
      })

      await tx.assignProductAttribute.deleteMany({
        where: { productId: id }
      })

      await tx.productReview.deleteMany({
        where: { productId: id }
      })

      // Delete the product
      await tx.product.delete({
        where: { id: id }
      })
    })

    return NextResponse.json({ 
      message: 'Product deleted successfully' 
    })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
