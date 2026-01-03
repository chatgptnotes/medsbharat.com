import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { createClient } from '@supabase/supabase-js'

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Lazy import prisma to avoid build-time initialization issues
let prismaInstance: any = null
const getPrisma = () => {
  if (!prismaInstance) {
    try {
      prismaInstance = require("@/lib/prisma").prisma
    } catch (error) {
      console.log("Prisma not available, using Supabase client")
      return null
    }
  }
  return prismaInstance
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        try {
          // Try Supabase client first
          console.log("🔄 Trying Supabase authentication...")
          
          const { data: user, error: getUserError } = await supabase
            .from('users')
            .select('id, email, name, phone, role, passwordHash')
            .eq('email', credentials.email)
            .single()

          if (!getUserError && user) {
            console.log("👤 Supabase user found:", user.email)

            if (!user.passwordHash) {
              console.log("❌ No password hash found")
              return null
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.passwordHash
            )

            console.log("🔑 Supabase password valid:", isPasswordValid)

            if (isPasswordValid) {
              console.log("✅ Supabase authentication successful for:", user.email)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              }
            }
          }

          // Fallback to Prisma
          console.log("🔄 Trying Prisma fallback...")
          const prisma = getPrisma()
          if (!prisma) {
            console.log("❌ Both Supabase and Prisma unavailable")
            return null
          }

          const prismaUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          console.log("👤 Prisma user found:", prismaUser ? "yes" : "no")

          if (!prismaUser || !prismaUser.passwordHash) {
            console.log("❌ User not found or no password hash")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            prismaUser.passwordHash
          )

          console.log("🔑 Prisma password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("❌ Invalid password")
            return null
          }

          console.log("✅ Prisma authentication successful for:", prismaUser.email)
          return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
            role: prismaUser.role,
          }
        } catch (error) {
          console.error("🚨 Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("📝 JWT callback - user:", user ? user.email : "none")
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      console.log("📅 Session callback - token:", token.id)
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "PATIENT" | "PHARMACY_OWNER" | "PHARMACY_STAFF" | "SUPER_ADMIN"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
