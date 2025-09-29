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

    // Get categories with subcategories and product counts
    const categories = await prisma.category.findMany({
      where: { parent_id: null },
      include: {
        subcategories: {
          include: {
            subcategories: true,
            products: {
              select: { id: true }
            }
          }
        },
        products: {
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform to include product counts and nested structure
    const transformedCategories = categories.map(category => ({
      ...category,
      productCount: category.products.length,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        productCount: sub.products.length,
        subcategories: sub.subcategories.map(subsub => ({
          ...subsub,
          productCount: subsub.products?.length || 0
        }))
      }))
    }))

    return NextResponse.json({ categories: transformedCategories })

  } catch (error) {
    console.error('Admin categories fetch error:', error)
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
        error: 'Category name is required' 
      }, { status: 400 })
    }

    // Check if category name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: data.name,
        parent_id: data.parent_id || null
      }
    })

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'Category with this name already exists' 
      }, { status: 400 })
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description || null,
        parent_id: data.parent_id || null,
        visibility: data.visibility ?? 1,
        is_special: data.is_special ? 1 : 0,
        icon: data.icon || null
      }
    })

    return NextResponse.json({ 
      message: 'Category created successfully', 
      category 
    }, { status: 201 })

  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
