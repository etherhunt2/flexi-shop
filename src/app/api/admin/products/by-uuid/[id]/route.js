import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidUUID } from '@/lib/uuid-utils'

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params
        const id = resolvedParams.id

        console.log('GET request for product with ID:', id)

        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.userType !== 'admin') {
            console.log('Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!isValidUUID(id)) {
            console.log('Invalid UUID format:', id)
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        console.log('Attempting to fetch product with relations...')

        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    brand: true,
                    categories: true,
                    stocks: true,
                    images: true,
                }
            })

            console.log('Database query result:', product)

            if (!product) {
                console.log('Product not found in database')
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }

            // Transform the response to match the expected format
            const transformedProduct = {
                ...product,
                stock: product.stocks[0] || null,
                is_featured: product.isFeatured,
                is_slider: product.isSlider,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                meta_keywords: product.metaKeywords,
                short_description: product.summary,
                digital_item: product.digitalItem === 'yes' ? 1 : 0,
                main_image: product.mainImage,
            }

            console.log('Successfully found and transformed product')
            return NextResponse.json(transformedProduct)
        } catch (dbError) {
            console.error('Database query error:', dbError)
            throw dbError // Rethrow to be caught by outer try-catch
        }
    } catch (error) {
        console.error('Product fetch error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        })

        // Check for specific database errors
        if (error.code === 'P2023') {
            return NextResponse.json({
                error: 'Invalid UUID format',
                details: error.message
            }, { status: 400 })
        }

        return NextResponse.json({
            error: 'Failed to fetch product',
            details: error.message,
            code: error.code
        }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.userType !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const id = resolvedParams.id
        const data = await request.json()

        if (!isValidUUID(id)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        // Validate required fields
        if (!data.name || !data.price || !data.brandId || !data.categoryIds?.length) {
            return NextResponse.json({
                error: 'Missing required fields: name, price, brand, and categories'
            }, { status: 400 })
        }

        // Validate brandId and categoryIds formats
        if (!isValidUUID(data.brandId)) {
            return NextResponse.json({ error: 'Invalid brandId format' }, { status: 400 })
        }

        if (!Array.isArray(data.categoryIds)) {
            return NextResponse.json({ error: 'Invalid categoryIds format' }, { status: 400 })
        }

        // Ensure each category id is valid
        for (const cid of data.categoryIds) {
            if (!isValidUUID(cid)) {
                return NextResponse.json({ error: `Invalid category id: ${cid}` }, { status: 400 })
            }
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        })

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Update product with transaction
        const product = await prisma.$transaction(async (tx) => {
            // Update the product
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    name: data.name,
                    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    price: data.price,
                    discountedPrice: data.discountedPrice,
                    summary: data.summary,
                    description: data.description,
                    brandId: data.brandId,
                    isFeatured: data.isFeatured ? 1 : 0,
                    isSlider: data.isSlider ? 1 : 0,
                    status: data.status || 1,
                    digitalItem: data.digitalItem ? 'yes' : null,
                    specification: data.specification || {},
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    metaKeywords: data.metaKeywords ? data.metaKeywords.split(',').map(k => k.trim()) : [],
                    mainImage: data.mainImage || '/placeholder-product.svg'
                }
            })

            // Update categories
            await tx.product.update({
                where: { id },
                data: {
                    categories: {
                        set: data.categoryIds.map(id => ({ id }))
                    }
                }
            })

            // Update stock if quantity provided
            if (data.quantity !== undefined) {
                const existingStock = await tx.productStock.findFirst({
                    where: { productId: id }
                })

                if (existingStock) {
                    await tx.productStock.update({
                        where: { id: existingStock.id },
                        data: {
                            quantity: data.quantity,
                            price: data.price
                        }
                    })
                } else if (data.quantity > 0) {
                    await tx.productStock.create({
                        data: {
                            productId: id,
                            quantity: data.quantity,
                            price: data.price
                        }
                    })
                }
            }

            return updatedProduct
        })

        return NextResponse.json({
            message: 'Product updated successfully',
            product
        })

    } catch (error) {
        console.error('Product update error:', error)
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.userType !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const id = resolvedParams.id

        if (!isValidUUID(id)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                orderDetails: {
                    select: { id: true }
                },
                carts: {
                    select: { id: true }
                },
                wishlists: {
                    select: { id: true }
                }
            }
        })

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Check if product has orders, carts, or wishlists
        if (existingProduct.orderDetails.length > 0) {
            return NextResponse.json({
                error: 'Cannot delete product that has been ordered'
            }, { status: 400 })
        }

        if (existingProduct.carts.length > 0 || existingProduct.wishlists.length > 0) {
            return NextResponse.json({
                error: 'Cannot delete product that is in carts or wishlists'
            }, { status: 400 })
        }

        // Delete product with transaction
        await prisma.$transaction(async (tx) => {
            // Delete related records first
            await tx.productStock.deleteMany({
                where: { productId: id }
            })

            await tx.productImage.deleteMany({
                where: { productId: id }
            })

            await tx.assignProductAttribute.deleteMany({
                where: { productId: id }
            })

            await tx.productReview.deleteMany({
                where: { productId: id }
            })

            // Delete the product
            await tx.product.delete({
                where: { id }
            })
        })

        return NextResponse.json({
            message: 'Product deleted successfully'
        })

    } catch (error) {
        console.error('Product deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}