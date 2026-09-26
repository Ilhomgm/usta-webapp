import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/admin-session.mjs'
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin)
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0 })
  return response
}
