import { PrismaClient } from '@prisma/client'

const globalForPrisma = global || { prisma: null }

export const prisma = globalForPrisma.prisma || (() => {
  const client = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

  client.$connect()
    .then(() => {
      console.log('Successfully connected to the database')
    })
    .catch((error) => {
      console.error('Failed to connect to the database:', error)
    })

  return client
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma