import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
  const directUrl = process.env.DIRECT_DATABASE_URL || 'NOT_SET'

  // Hide the password in the URL for security
  const sanitizedURL = dbUrl.replace(/:([^@]+)@/, ':***@')
  const sanitizedDirectURL = directUrl.replace(/:([^@]+)@/, ':***@')

  // Show first 30 chars to debug the issue
  const first30 = dbUrl.substring(0, 30)
  const first30Direct = directUrl.substring(0, 30)

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DATABASE_URL_SANITIZED: sanitizedURL,
    DATABASE_URL_LENGTH: dbUrl.length,
    DATABASE_URL_FIRST_30: first30,
    DATABASE_URL_ENDS_WITH_NEWLINE: dbUrl.endsWith('\n'),
    DATABASE_URL_ENDS_WITH_POSTGRES: dbUrl.endsWith('postgres'),
    DIRECT_DATABASE_URL_SET: !!process.env.DIRECT_DATABASE_URL,
    DIRECT_DATABASE_URL_SANITIZED: sanitizedDirectURL,
    DIRECT_DATABASE_URL_FIRST_30: first30Direct,
    DIRECT_DATABASE_URL_LENGTH: directUrl.length,
  })
}
