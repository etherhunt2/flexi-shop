const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkIfSeedNeeded() {
    // Check if admin user exists
    const adminExists = await prisma.admin.findFirst({
        where: { email: 'admin@pixshop.com' }
    })

    // Check if demo user exists
    const userExists = await prisma.user.findFirst({
        where: { email: 'user@pixshop.com' }
    })

    return !adminExists || !userExists
}

async function main() {
    // Check if seeding is needed
    const shouldSeed = await checkIfSeedNeeded()

    if (!shouldSeed) {
        console.log('✅ Database already seeded, skipping...')
        return
    }

    console.log('🌱 Seeding database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@pixshop.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@pixshop.com',
            username: 'admin',
            password: adminPassword,
        },
    })

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'user@pixshop.com' },
        update: {},
        create: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'user@pixshop.com',
            username: 'johndoe',
            password: userPassword,
            mobile: '+1234567890',
            countryCode: 'US',
            status: 1,
            ev: 1,
            sv: 1,
            kv: 1,
        },
    })

    console.log('✅ Database seeded successfully!')
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