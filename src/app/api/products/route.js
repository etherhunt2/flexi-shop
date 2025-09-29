import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'latest'
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 999999

    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      status: 1,
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    }

    if (category) {
      where.categories = {
        some: {
          id: parseInt(category)
        }
      }
    }

    if (brand) {
      where.brandId = parseInt(brand)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build orderBy clause
    let orderBy = {}
    switch (sort) {
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length
    }))

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // This would typically require admin authentication
    // Add authentication middleware here
    
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      },
      include: {
        brand: true,
        categories: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
