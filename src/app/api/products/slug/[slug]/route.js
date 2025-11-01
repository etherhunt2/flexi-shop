import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const { slug } = params

        if (!slug) {
            return NextResponse.json(
                { error: 'Product slug is required' },
                { status: 400 }
            )
        }

        console.log('Looking up product with slug:', slug)

        const product = await prisma.product.findUnique({
            where: {
                slug,
                status: 1 // Only return active products
            },
            include: {
                brand: true,
                categories: true,
                images: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                stocks: true,
                assignAttributes: {
                    include: {
                        attribute: true
                    }
                }
            }
        })

        if (!product) {
            console.log('Product not found with slug:', slug)
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        console.log('Found product:', {
            id: product.id,
            name: product.name,
            slug: product.slug
        })

        // Calculate average rating
        const averageRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0

        // Get related products
        const relatedProducts = await prisma.product.findMany({
            where: {
                AND: [
                    { slug: { not: product.slug } },
                    { status: 1 },
                    {
                        OR: [
                            { brandId: product.brandId },
                            {
                                categoryIds: {
                                    hasSome: product.categoryIds
                                }
                            }
                        ]
                    }
                ]
            },
            include: {
                brand: true,
                categories: true,
                reviews: {
                    select: {
                        rating: true
                    }
                },
                images: {
                    orderBy: {
                        sortOrder: 'asc'
                    },
                    take: 1
                }
            },
            take: 8
        })

        console.log('Found related products:', relatedProducts.length)

        return NextResponse.json({
            ...product,
            averageRating,
            reviewCount: product.reviews.length,
            relatedProducts: relatedProducts.map(p => ({
                ...p,
                averageRating: p.reviews.length > 0
                    ? p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length
                    : 0,
                reviewCount: p.reviews.length
            }))
        })
    } catch (error) {
        console.error('Product detail API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}