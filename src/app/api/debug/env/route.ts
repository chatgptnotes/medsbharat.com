import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT_SET'

  // Hide the password in the URL for security
  const sanitizedURL = dbUrl.replace(/:([^@]+)@/, ':***@')

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DATABASE_URL_SANITIZED: sanitizedURL,
    DATABASE_URL_LENGTH: dbUrl.length,
    DATABASE_URL_ENDS_WITH_NEWLINE: dbUrl.endsWith('\n'),
    DATABASE_URL_ENDS_WITH_POSTGRES: dbUrl.endsWith('postgres'),
  })
}
