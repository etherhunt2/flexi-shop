import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const { slug } = await params

        const product = await prisma.product.findUnique({
            where: {
                slug
            },
            include: {
                brand: true,
                categories: true,
                images: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                image: true
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
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

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
                    where: {
                        assignProductAttributeId: ""
                    },
                    take: 1
                }
            },
            take: 8
        })

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