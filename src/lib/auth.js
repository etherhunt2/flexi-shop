import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' } // 'user' or 'admin'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          let user = null
          
          if (credentials.userType === 'admin') {
            user = await prisma.admin.findUnique({
              where: { email: credentials.email }
            })
          } else {
            user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })
          }

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: credentials.userType === 'admin' ? user.name : `${user.firstname} ${user.lastname}`,
            userType: credentials.userType || 'user',
            status: user.status
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.userType = token.userType
      session.user.status = token.status
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register'
  }
}

export default NextAuth(authOptions)
