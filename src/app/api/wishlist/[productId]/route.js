import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidUUID } from '@/lib/uuid-utils'

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = params

    // Try to find the product first
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find and delete wishlist item
    const deletedItem = await prisma.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        productId
      }
    })

    if (deletedItem.count === 0) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
