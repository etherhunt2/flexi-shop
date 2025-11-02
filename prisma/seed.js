const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@pixshop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@pixshop.com',
      password: 12345678,
      status: 1
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
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

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'apple' },
      update: {},
      create: {
        name: 'Apple',
        slug: 'apple',
        isTop: 1,
        status: 1
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'samsung' },
      update: {},
      create: {
        name: 'Samsung',
        slug: 'samsung',
        isTop: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'nike' },
      update: {},
      create: {
        name: 'Nike',
        slug: 'nike',
        isTop: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: {
        name: 'Adidas',
        slug: 'adidas',
        isTop: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'sony' },
      update: {},
      create: {
        name: 'Sony',
        slug: 'sony',
        isTop: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'lg' },
      update: {},
      create: {
        name: 'LG',
        slug: 'lg',
        isTop: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
  ])

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        icon: '📱',
        description: 'Latest electronic gadgets and devices',
        visibility: 1,
        isSpecial: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        icon: '👕',
        description: 'Trendy clothing and accessories',
        visibility: 1,
        isSpecial: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        icon: '🏠',
        description: 'Everything for your home and garden',
        visibility: 1,
        isSpecial: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports & Outdoors',
        slug: 'sports',
        icon: '⚽',
        description: 'Sports equipment and outdoor gear',
        visibility: 1,
        isSpecial: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Books & Media',
        slug: 'books',
        icon: '📚',
        description: 'Books, movies, and digital media',
        visibility: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
    prisma.category.upsert({
      where: { slug: 'health' },
      update: {},
      create: {
        name: 'Health & Beauty',
        slug: 'health',
        icon: '💄',
        description: 'Health and beauty products',
        visibility: 1,
        status: 1,
        productIds: [], // Initialize empty array for MongoDB
      },
    }),
  ])

  // Create products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      summary: 'Latest iPhone with advanced camera system',
      description: 'The iPhone 15 Pro features a titanium design, advanced camera system with 5x telephoto zoom, and the powerful A17 Pro chip.',
      brandId: brands[0].id, // Apple
      categoryIds: [categories[0].id], // Electronics
      price: 999.00,
      discountedPrice: 899.00,
      quantity: 50,
      isFeatured: 1,
      isSlider: 1,
      status: 1,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      summary: 'Premium Android smartphone with S Pen',
      description: 'Samsung Galaxy S24 Ultra with built-in S Pen, 200MP camera, and AI-powered features.',
      brandId: brands[1].id, // Samsung
      categoryIds: [categories[0].id], // Electronics
      price: 1199.00,
      discountedPrice: 1099.00,
      quantity: 30,
      isFeatured: 1,
      status: 1,
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      summary: 'Comfortable running shoes with Max Air cushioning',
      description: 'Nike Air Max 270 features the largest Max Air unit yet for all-day comfort and style.',
      brandId: brands[2].id, // Nike
      categoryIds: [categories[1].id, categories[3].id], // Fashion, Sports
      price: 150.00,
      quantity: 100,
      isFeatured: 1,
      status: 1,
    },
    {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      summary: 'Premium running shoes with Boost technology',
      description: 'Adidas Ultraboost 22 with responsive Boost midsole and Primeknit upper for ultimate comfort.',
      brandId: brands[3].id, // Adidas
      categoryIds: [categories[1].id, categories[3].id], // Fashion, Sports
      price: 180.00,
      discountedPrice: 144.00,
      quantity: 75,
      isFeatured: 1,
      status: 1,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5-headphones',
      summary: 'Industry-leading noise canceling headphones',
      description: 'Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation and 30-hour battery life.',
      brandId: brands[4].id, // Sony
      categoryIds: [categories[0].id], // Electronics
      price: 399.00,
      discountedPrice: 299.00,
      quantity: 40,
      isFeatured: 1,
      status: 1,
    },
    {
      name: 'LG OLED C3 55" TV',
      slug: 'lg-oled-c3-55-tv',
      summary: '55-inch OLED 4K Smart TV',
      description: 'LG OLED C3 55-inch 4K Smart TV with perfect blacks, vibrant colors, and webOS smart platform.',
      brandId: brands[5].id, // LG
      categoryIds: [categories[0].id, categories[2].id], // Electronics, Home & Garden
      price: 1499.00,
      discountedPrice: 1299.00,
      quantity: 20,
      isFeatured: 1,
      isSlider: 1,
      status: 1,
    },
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      summary: 'Lightweight laptop with M2 chip',
      description: 'MacBook Air with M2 chip delivers incredible performance in a thin and light design.',
      brandId: brands[0].id, // Apple
      categoryIds: [categories[0].id], // Electronics
      price: 1199.00,
      quantity: 25,
      isFeatured: 1,
      status: 1,
    },
    {
      name: 'Samsung 4K Monitor 32"',
      slug: 'samsung-4k-monitor-32',
      summary: 'Professional 4K monitor for work and gaming',
      description: 'Samsung 32-inch 4K UHD monitor with HDR support and USB-C connectivity.',
      brandId: brands[1].id, // Samsung
      categoryIds: [categories[0].id], // Electronics
      price: 599.00,
      discountedPrice: 499.00,
      quantity: 35,
      status: 1,
    },
  ]

  for (const productData of products) {
    const { categoryIds, ...productInfo } = productData

    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {},
      create: {
        ...productInfo,
        categoryIds: categoryIds, // MongoDB uses direct array assignment
        offerIds: [],
        couponIds: []
      },
    })

    // Add some reviews
    try {
      await prisma.productReview.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: 5,
          review: 'Excellent product! Highly recommended.',
          status: 1,
        },
      })
    } catch (e) {
      // Review might already exist, skip
    }
  }

  // Create a sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10.00,
      minAmount: 50.00,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: 100,
      usageCount: 0,
      status: 1,
      productIds: [], // Initialize empty array for MongoDB
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin: admin@pixshop.com / admin123')
  console.log('👤 User: user@pixshop.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
