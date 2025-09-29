import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { firstname, lastname, email, password, confirmPassword, mobile, countryCode } = await request.json()

    // Validation
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate username from email
    const username = email.split('@')[0] + Math.random().toString(36).substr(2, 4)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
        mobile,
        countryCode,
        status: 1,
        ev: 0, // email not verified
        sv: 0, // mobile not verified
        kv: 1  // kyc not required by default
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        mobile: true,
        status: true,
        ev: true,
        sv: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'User registered successfully',
      user
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
