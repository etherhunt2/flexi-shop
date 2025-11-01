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

        // Clear all cart items for the user
        await prisma.cart.deleteMany({
            where: { userId: session.user.id }
        })

        return NextResponse.json({ message: 'Cart cleared successfully' })
    } catch (error) {
        console.error('Clear cart error:', error)
        return NextResponse.json(
            { error: 'Failed to clear cart' },
            { status: 500 }
        )
    }
}