import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all categories for admin view with proper hierarchy
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: { id: true }
        },
        subcategories: {
          include: {
            products: {
              select: { id: true }
            },
            subcategories: {
              include: {
                products: {
                  select: { id: true }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform categories to include product counts and maintain hierarchy
    const transformedCategories = categories.map(category => {
      // Recursively calculate product counts for nested subcategories
      const processCategory = (cat) => ({
        ...cat,
        productCount: cat.products.length,
        subcategories: cat.subcategories.map(processCategory)
      })

      return processCategory(category)
    })

    // Filter to only root categories (those without parentId)
    const rootCategories = transformedCategories.filter(category => !category.parentId)

    return NextResponse.json(rootCategories)

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
        parentId: data.parentId || null
      }
    })

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'Category with this name already exists' 
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = generateSlug(data.name)

    // Check if slug already exists (to avoid uniqueness constraint error)
    const existingSlug = await prisma.category.findFirst({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json({
        error: 'A category with this name already exists'
      }, { status: 400 })
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || null,
        parentId: data.parentId || null,
        visibility: data.visibility ?? 1,
        isSpecial: data.isSpecial ? 1 : 0,
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
