import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
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
          throw new Error('Missing credentials')
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
            throw new Error('User not found')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          // Ensure we have a valid name
          const userName = user.name || user.email.split('@')[0]

          return {
            id: user.id, // UUID is already a string
            email: user.email,
            name: userName,
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
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error'
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("Sign in successful", { user, account })
    },
    async signOut({ session, token }) {
      console.log("Sign out successful")
    },
    async error(error) {
      console.error("Authentication error", error)
    }
  }
}

export default NextAuth(authOptions)
