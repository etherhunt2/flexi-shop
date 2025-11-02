import { PrismaClient } from '@prisma/client'

const globalForPrisma = global || { prisma: null }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
})

// Logging for development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('beforeExit', () => {
    console.log('Disconnecting from database...')
  })

  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Duration: ' + e.duration + 'ms')
  })
}

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch((error) => {
    console.error('Database connection error:', error)
    process.exit(1) // Exit if we can't connect to the database
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma