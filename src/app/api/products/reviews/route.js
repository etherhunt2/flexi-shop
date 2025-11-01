import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { productId, rating, review } = await request.json()

        if (!productId || !rating || !review) {
            return NextResponse.json(
                { error: 'Product ID, rating, and review text are required' },
                { status: 400 }
            )
        }

        // Validate rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if user has already reviewed this product
        const existingReview = await prisma.productReview.findFirst({
            where: {
                userId: session.user.id,
                productId: productId
            }
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this product' },
                { status: 400 }
            )
        }

        // Create the review
        const newReview = await prisma.productReview.create({
            data: {
                productId,
                userId: session.user.id,
                rating,
                review,
                status: 1
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(newReview, { status: 201 })
    } catch (error) {
        console.error('Review POST error:', error)
        return NextResponse.json(
            { error: 'Failed to submit review' },
            { status: 500 }
        )
    }
}