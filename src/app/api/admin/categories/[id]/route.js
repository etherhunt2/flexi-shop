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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ 
        error: 'Category name is required' 
      }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if name is already taken by another category with same parent
    const nameExists = await prisma.category.findFirst({
      where: { 
        name: data.name,
        parentId: data.parentId || null,
        id: { not: id }
      }
    })

    if (nameExists) {
      return NextResponse.json({ 
        error: 'Category with this name already exists in the same level' 
      }, { status: 400 })
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description || null,
        parentId: data.parentId || null,
        visibility: data.visibility ?? 1,
        isSpecial: data.isSpecial ? 1 : 0,
        icon: data.icon || null
      }
    })

    return NextResponse.json({ 
      message: 'Category updated successfully', 
      category 
    })

  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
      include: {
        products: {
          select: { id: true }
        },
        children: {
          select: { id: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has products or children
    if (existingCategory.products.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category that has products associated with it' 
      }, { status: 400 })
    }

    if (existingCategory.children.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category that has children' 
      }, { status: 400 })
    }

    // Delete category
    await prisma.category.delete({
      where: { id: id }
    })

    return NextResponse.json({ 
      message: 'Category deleted successfully' 
    })

  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
