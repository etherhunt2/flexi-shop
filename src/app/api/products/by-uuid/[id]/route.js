import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const { id } = params

        const product = await prisma.product.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                slug: true,
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Product detail API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}