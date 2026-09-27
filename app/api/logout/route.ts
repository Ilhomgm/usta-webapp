import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/admin-session.mjs'
import { originAllowed, secureCookie } from '@/lib/request-security.mjs'
export async function POST(request: NextRequest) {
  if (!originAllowed(request.headers.get('origin'),request.nextUrl.origin,process.env.USTA_PUBLIC_ORIGIN))
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', { path: '/', httpOnly: true, secure: secureCookie(request.nextUrl.origin), sameSite: 'strict', maxAge: 0 })
  return response
}
