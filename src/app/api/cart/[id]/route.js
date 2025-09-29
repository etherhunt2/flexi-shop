import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      )
    }

    // Find cart item and verify ownership
    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const isOwner = session?.user?.id 
      ? cartItem.userId === parseInt(session.user.id)
      : cartItem.sessionId === request.headers.get('x-session-id')

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check stock
    if (cartItem.product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { quantity },
      include: {
        product: {
          include: {
            brand: true,
            images: {
              where: {
                assignProductAttributeId: 0
              },
              take: 1
            }
          }
        }
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    // Find cart item and verify ownership
    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(id) }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const isOwner = session?.user?.id 
      ? cartItem.userId === parseInt(session.user.id)
      : cartItem.sessionId === request.headers.get('x-session-id')

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.cart.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
