import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidUUID } from '@/lib/uuid-utils'

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
    const sortBy = searchParams.get('sortBy') || 'createdAt'
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
      if (isValidUUID(category)) {
        where.categories = {
          some: {
            id: category
          }
        }
      } else {
        console.warn('Ignoring invalid category id filter:', category)
      }
    }

    if (brand) {
      if (isValidUUID(brand)) {
        where.brandId = brand
      } else {
        console.warn('Ignoring invalid brand id filter:', brand)
      }
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

    // Normalize and validate brandId (accept either string or object with id)
    let brandIdValue = null
    if (typeof data.brandId === 'object' && data.brandId !== null) {
      // e.g. { id: '...' } or Prisma connect style
      brandIdValue = data.brandId.id || data.brandId._id || null
    } else {
      brandIdValue = data.brandId
    }

    if (!isValidUUID(brandIdValue)) {
      return NextResponse.json({ error: 'Invalid brandId format. Expected UUID string.' }, { status: 400 })
    }

    if (!Array.isArray(data.categoryIds)) {
      return NextResponse.json({ error: 'Invalid categoryIds format' }, { status: 400 })
    }

    // Validate categoryIds: accept strings or objects with id and ensure valid UUID strings
    const validatedCategoryIds = data.categoryIds.map((rawId) => {
      let id = rawId
      if (typeof rawId === 'object' && rawId !== null) {
        id = rawId.id || rawId._id || null
      }

      if (!isValidUUID(id)) {
        throw new Error(`Invalid category ID format: ${JSON.stringify(rawId)}`)
      }
      return id
    })
    // Create product with transaction: create product, connect categories, create initial stock
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          model: data.model || null,
          summary: data.summary || null,
          description: data.description || null,
          extraDescriptions: data.extraDescriptions || null,
          specification: data.specification || null,
          brandId: brandIdValue, // MongoDB ObjectId as string
          sku: data.sku || null,
          price: parseFloat(data.price),
          discountType: parseInt(data.discountType || '1'),
          discount: parseFloat(data.discount || '0'),
          discountedPrice: parseFloat(data.discountedPrice || '0'),
          quantity: parseInt(data.quantity || '0'),
          sold: parseInt(data.sold || '0'),
          minimumBuyQty: parseInt(data.minimumBuyQty || '1'),
          stockStatus: parseInt(data.stockStatus || '1'),
          track: parseInt(data.track || '1'),
          featured: parseInt(data.featured || '0'),
          todaysDeal: parseInt(data.todaysDeal || '0'),
          status: parseInt(data.status || '1'),
          isFeatured: parseInt(data.isFeatured ? '1' : '0'),
          isSlider: parseInt(data.isSlider ? '1' : '0'),
          mainImage: data.mainImage || '/placeholder-product.svg',
          hoverImage: data.hoverImage || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords ? { keywords: data.metaKeywords.split(',').map(k => k.trim()) } : null,
          digitalItem: data.digitalItem || null,
          digitalFile: data.digitalFile || null,
          categoryIds: validatedCategoryIds
        }
      })

      // Connect categories using validatedCategoryIds (strings)
      if (validatedCategoryIds.length) {
        await tx.product.update({
          where: { id: newProduct.id },
          data: {
            categories: {
              connect: validatedCategoryIds.map(id => ({ id }))
            }
          }
        })
      }

      // Create initial stock if quantity provided
      if (parseInt(data.quantity || '0') > 0) {
        await tx.productStock.create({
          data: {
            productId: newProduct.id,
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price)
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
