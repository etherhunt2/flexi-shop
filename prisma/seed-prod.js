const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkIfSeedNeeded() {
    try {
        // Check if admin user exists
        const adminExists = await prisma.admin.findFirst({
            where: { email: 'admin@pixshop.com' }
        })

        // Check if demo user exists
        const userExists = await prisma.user.findFirst({
            where: { email: 'user@pixshop.com' }
        })

        // Check if basic categories exist
        const categoriesExist = await prisma.category.findFirst({
            where: { slug: 'electronics' }
        })

        return !adminExists || !userExists || !categoriesExist
    } catch (error) {
        console.error('❌ Error checking seed status:', error)
        // In production, assume seeding is needed if check fails
        return true
    }
}

async function main() {
    // Check if seeding is needed
    const shouldSeed = await checkIfSeedNeeded()

    if (!shouldSeed) {
        console.log('✅ Database already seeded, skipping...')
        return
    }

    console.log('🌱 Seeding production database...')

    // Create admin user
    try {
        const adminPassword = await bcrypt.hash('admin123', 12)
        await prisma.admin.upsert({
            where: { email: 'admin@pixshop.com' },
            update: {},
            create: {
                name: 'Admin User',
                email: 'admin@pixshop.com',
                password: adminPassword,
                status: 1
            },
        })
        console.log('✅ Admin user created successfully')
    } catch (error) {
        console.error('❌ Error creating admin user:', error)
        // Don't throw in production to avoid deployment failure
        if (process.env.NODE_ENV !== 'production') throw error
    }

    // Create test user
    try {
        const userPassword = await bcrypt.hash('user123', 12)
        await prisma.user.upsert({
            where: { email: 'user@pixshop.com' },
            update: {},
            create: {
                name: 'John Doe',
                email: 'user@pixshop.com',
                password: userPassword,
                phone: '+1234567890',
                status: 1,
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'US'
                }
            },
        })
        console.log('✅ Test user created successfully')
    } catch (error) {
        console.error('❌ Error creating test user:', error)
        if (process.env.NODE_ENV !== 'production') throw error
    }

    // Create basic categories
    try {
        const categories = [
            {
                name: 'Electronics',
                slug: 'electronics',
                icon: '📱',
                description: 'Latest electronic gadgets and devices'
            },
            {
                name: 'Fashion',
                slug: 'fashion',
                icon: '👕',
                description: 'Trendy clothing and accessories'
            }
        ]

        for (const category of categories) {
            await prisma.category.upsert({
                where: { slug: category.slug },
                update: {},
                create: {
                    ...category,
                    visibility: 1,
                    isSpecial: 1,
                    status: 1,
                    productIds: []
                },
            })
        }
        console.log('✅ Categories created successfully')
    } catch (error) {
        console.error('❌ Error creating categories:', error)
        if (process.env.NODE_ENV !== 'production') throw error
    }

    console.log('✅ Production database seeded successfully!')
    console.log('👤 Admin: admin@pixshop.com / admin123')
    console.log('👤 User: user@pixshop.com / user123')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        // Don't exit with error in production to prevent deployment failure
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1)
        }
    })
    .finally(async () => {
        await prisma.$disconnect()
    })