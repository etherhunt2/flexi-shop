import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidUUID } from '@/lib/uuid-utils'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate UUID
    if (!isValidUUID(session.user.id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            brand: true,
            categories: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              },
              take: 1
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average ratings
    const wishlistWithRatings = wishlistItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        averageRating: item.product.reviews.length > 0
          ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length
          : 0,
        reviewCount: item.product.reviews.length
      }
    }))

    return NextResponse.json({
      items: wishlistWithRatings,
      count: wishlistItems.length
    })
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

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

    // Ensure user ID is valid
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId: productId
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId: productId
      },
      include: {
        product: {
          include: {
            brand: true,
            categories: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              },
              take: 1
            }
          }
        }
      }
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
