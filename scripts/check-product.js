const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProduct() {
    try {
        const slug = 'samsung-galaxy-s24-ultra-5g-ai'
        const product = await prisma.product.findUnique({
            where: { slug },
            select: { id: true, name: true, slug: true }
        })

        console.log('Product found:', product)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkProduct()