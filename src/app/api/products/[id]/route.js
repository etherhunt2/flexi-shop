import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const product = await prisma.product.findUnique({
      where: { 
        id: parseInt(id) 
      },
      include: {
        brand: true,
        categories: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        stocks: true,
        assignAttributes: {
          include: {
            productAttribute: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: product.id } },
          { status: 1 },
          {
            OR: [
              { brandId: product.brandId },
              {
                categories: {
                  some: {
                    id: {
                      in: product.categories.map(cat => cat.id)
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        brand: true,
        categories: true,
        reviews: {
          select: {
            rating: true
          }
        },
        images: {
          where: {
            assignProductAttributeId: 0
          },
          take: 1
        }
      },
      take: 8
    })

    return NextResponse.json({
      ...product,
      averageRating,
      reviewCount: product.reviews.length,
      relatedProducts: relatedProducts.map(p => ({
        ...p,
        averageRating: p.reviews.length > 0 
          ? p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length
          : 0,
        reviewCount: p.reviews.length
      }))
    })
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    
    // This would typically require admin authentication
    // Add authentication middleware here
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: {
        brand: true,
        categories: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // This would typically require admin authentication
    // Add authentication middleware here
    
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
