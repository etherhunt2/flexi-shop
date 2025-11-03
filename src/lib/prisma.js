import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
let prisma = null

if (typeof window === 'undefined') {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })

    // Handle initial connection
    global.prisma.$connect()
      .then(() => {
        console.log('Successfully connected to the database')
      })
      .catch((error) => {
        console.error('Database connection error:', error)
        if (process.env.NODE_ENV === 'production') {
          console.error('Fatal: Could not connect to the database')
        } else {
          throw error
        }
      })

    if (process.env.NODE_ENV === 'development') {
      // Add process event listeners for graceful shutdown in development
      process.on('beforeExit', async () => {
        await global.prisma.$disconnect()
      })
    }
  }
  prisma = global.prisma
}

export { prisma }
export default prisma