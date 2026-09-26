import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { configured, passwordMatches, createSession, COOKIE_NAME, SESSION_TTL } from '@/lib/admin-session.mjs'

export const runtime = 'nodejs'
// Single-instance safeguard; production needs shared rate limiting at the gateway.
let attempts = 0
let windowStart = Date.now()

export async function POST(request: NextRequest) {
  if (!configured()) return NextResponse.json({ error: 'Admin access is not configured' }, { status: 503 })
  if (request.headers.get('origin') !== request.nextUrl.origin)
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  if (Date.now() - windowStart > 60000) { attempts = 0; windowStart = Date.now() }
  if (++attempts > 20)
    return NextResponse.json({ error: 'Try again later' }, { status: 429, headers: { 'Retry-After': '60' } })
  let body: unknown
  try {
    const raw = await request.text()
    if (raw.length > 2048) return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    body = JSON.parse(raw)
  } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const password = body && typeof body === 'object' && 'password' in body ? body.password : null
  if (!passwordMatches(password))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const response = NextResponse.json({ success: true })
  response.headers.set('Cache-Control', 'no-store')
  response.cookies.set(COOKIE_NAME, createSession(), {
    path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: SESSION_TTL,
  })
  return response
}

