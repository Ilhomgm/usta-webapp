import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth')?.value === 'true'
  const privatePaths = ['/dashboard', '/masters']

  const isPrivate = privatePaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPrivate && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/masters/:path*'],
}
