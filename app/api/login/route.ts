import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const validPassword = process.env.ADMIN_PASSWORD || 'usta123'

  if (password === validPassword) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth', 'true', { path: '/', httpOnly: true })
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
