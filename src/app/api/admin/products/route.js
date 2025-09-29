import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20

    // Build where clause
    const where = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
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

    if (status !== '') {
      where.status = parseInt(status)
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get products with relations
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: {
          select: { id: true, name: true }
        },
        categories: {
          select: { id: true, name: true }
        },
        stocks: {
          select: { quantity: true }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: offset,
      take: limit
    })

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    // Calculate stock quantity for each product
    const productsWithStock = products.map(product => ({
      ...product,
      quantity: product.stocks.reduce((total, stock) => total + stock.quantity, 0)
    }))

    return NextResponse.json({
      products: productsWithStock,
      pagination: {
        page,
        pages: totalPages,
        limit,
        total: totalCount
      }
    })

  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.price || !data.brandId || !data.categoryIds?.length) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, brand, and categories' 
      }, { status: 400 })
    }

    // Create product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
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

      // Connect categories
      await tx.product.update({
        where: { id: newProduct.id },
        data: {
          categories: {
            connect: data.categoryIds.map(id => ({ id: parseInt(id) }))
          }
        }
      })

      // Create initial stock if quantity provided
      if (data.quantity > 0) {
        await tx.productStock.create({
          data: {
            productId: newProduct.id,
            quantity: data.quantity,
            price: data.price
          }
        })
      }

      return newProduct
    })

    return NextResponse.json({ 
      message: 'Product created successfully', 
      product 
    }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
