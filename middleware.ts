import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/dashboard/:path*', '/masters/:path*']
}

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value
  const isLoggedIn = auth === 'true'

  if (!isLoggedIn) {
    return NextResponse.redirect('/login')
  }

  return NextResponse.next()
}
