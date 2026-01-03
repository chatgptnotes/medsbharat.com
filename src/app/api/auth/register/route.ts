import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Lazy import prisma as fallback
let prismaInstance: any = null
const getPrisma = () => {
  if (!prismaInstance) {
    try {
      prismaInstance = require('@/lib/prisma').prisma
    } catch (error) {
      console.log("Prisma not available, using Supabase client")
      return null
    }
  }
  return prismaInstance
}

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, phone, password } = validationResult.data

    try {
      // Try Supabase client first
      console.log("🔄 Trying Supabase client for registration...")
      
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser && !checkError) {
        return NextResponse.json(
          { error: 'Email already registered. Please login instead.' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user via Supabase
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          phone,
          passwordHash: hashedPassword,
          role: 'PATIENT',
          emailVerified: new Date().toISOString(),
          phoneVerified: new Date().toISOString()
        })
        .select('id, name, email, phone, role, createdAt')
        .single()

      if (createError) {
        console.error("❌ Supabase error:", createError)
        throw new Error("Supabase registration failed")
      }

      console.log("✅ Supabase registration successful")
      return NextResponse.json(
        {
          message: 'Account created successfully',
          user: newUser,
        },
        { status: 201 }
      )

    } catch (supabaseError) {
      console.error("🚨 Supabase failed, trying Prisma fallback:", supabaseError)
      
      // Fallback to Prisma if Supabase fails
      const prisma = getPrisma()
      if (!prisma) {
        throw new Error("Both Supabase and Prisma unavailable")
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered. Please login instead.' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash: hashedPassword,
          role: 'PATIENT',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      })

      return NextResponse.json(
        {
          message: 'Account created successfully',
          user,
        },
        { status: 201 }
      )
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Error name:', error?.name)

    // In production, log detailed error but return generic message
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error?.message || 'An error occurred during registration'
      : 'An error occurred during registration. Please try again.'

    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    )
  }
}
