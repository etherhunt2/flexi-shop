import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const isTop = searchParams.get('isTop') === 'true'

    let where = {
      status: 1
    }

    if (isTop) {
      where.isTop = 1
    }

    const brands = await prisma.brand.findMany({
      where,
      include: {
        ...(includeProducts && {
          products: {
            where: {
              status: 1
            },
            include: {
              categories: true,
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
    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        const productCount = await prisma.product.count({
          where: {
            status: 1,
            brandId: brand.id
          }
        })

        let processedProducts = []
        if (includeProducts && brand.products) {
          processedProducts = brand.products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
              ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
              : 0,
            reviewCount: product.reviews.length
          }))
        }

        return {
          ...brand,
          productCount,
          ...(includeProducts && { products: processedProducts })
        }
      })
    )

    return NextResponse.json(brandsWithCounts)
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // This would typically require admin authentication
    // Add authentication middleware here

    const brand = await prisma.brand.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Create brand error:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
