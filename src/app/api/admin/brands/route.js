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

    // Get brands with product counts
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform to include product counts
    const transformedBrands = brands.map(brand => ({
      ...brand,
      productCount: brand.products.length
    }))

    return NextResponse.json({ brands: transformedBrands })

  } catch (error) {
    console.error('Admin brands fetch error:', error)
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
    if (!data.name) {
      return NextResponse.json({ 
        error: 'Brand name is required' 
      }, { status: 400 })
    }

    // Check if brand name already exists
    const existingBrand = await prisma.brand.findFirst({
      where: { name: data.name }
    })

    if (existingBrand) {
      return NextResponse.json({ 
        error: 'Brand with this name already exists' 
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || null,
        image: data.image || null,
        isTop: data.isTop ? 1 : 0,
        status: data.status ?? 1
      }
    })

    return NextResponse.json({ 
      message: 'Brand created successfully', 
      brand 
    }, { status: 201 })

  } catch (error) {
    console.error('Brand creation error:', error)
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 })
  }
}
