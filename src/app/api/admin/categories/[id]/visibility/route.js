import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { visibility } = await request.json()

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Update visibility
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        visibility: visibility
      }
    })

    return NextResponse.json({ 
      message: 'Category visibility updated successfully', 
      category 
    })

  } catch (error) {
    console.error('Category visibility update error:', error)
    return NextResponse.json({ error: 'Failed to update category visibility' }, { status: 500 })
  }
}
