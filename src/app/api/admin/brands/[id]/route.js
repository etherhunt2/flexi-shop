import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ 
        error: 'Brand name is required' 
      }, { status: 400 })
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Check if name is already taken by another brand
    const nameExists = await prisma.brand.findFirst({
      where: { 
        name: data.name,
        id: { not: parseInt(id) }
      }
    })

    if (nameExists) {
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

    // Update brand
    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: slug,
        image: data.image || null,
        isTop: data.isTop ? 1 : 0,
        status: data.status ?? 1
      }
    })

    return NextResponse.json({ 
      message: 'Brand updated successfully', 
      brand 
    })

  } catch (error) {
    console.error('Brand update error:', error)
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          select: { id: true }
        }
      }
    })

    if (!existingBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Check if brand has products
    if (existingBrand.products.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete brand that has products associated with it' 
      }, { status: 400 })
    }

    // Delete brand
    await prisma.brand.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ 
      message: 'Brand deleted successfully' 
    })

  } catch (error) {
    console.error('Brand deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}
