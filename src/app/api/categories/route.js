import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseUUID } from '@/lib/uuid-utils'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const parentId = searchParams.get('parentId')

    let where = {
      visibility: 1,
      status: 1
    }

    if (parentId !== null) {
      where.parentId = parentId ? parseUUID(parentId) : null
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: {
          where: {
            visibility: 1,
            status: 1
          }
        },
        ...(includeProducts && {
          products: {
            where: {
              status: 1
            },
            include: {
              brand: true,
              images: {
                orderBy: {
                  sortOrder: 'asc'
                },
                take: 1
              },
              reviews: {
                select: {
                  rating: true
                }
              }
            },
            take: 8
          }
        })
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Calculate product counts and average ratings
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await prisma.product.count({
          where: {
            status: 1,
            categoryIds: {
              has: category.id
            }
          }
        })

        let processedProducts = []
        if (includeProducts && category.products) {
          processedProducts = category.products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
              ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
              : 0,
            reviewCount: product.reviews.length
          }))
        }

        return {
          ...category,
          productCount,
          ...(includeProducts && { products: processedProducts })
        }
      })
    )

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // This would typically require admin authentication
    // Add authentication middleware here

    const category = await prisma.category.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        productIds: data.productIds || []
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
