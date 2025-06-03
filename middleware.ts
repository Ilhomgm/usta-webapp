import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')
  const cookie = request.cookies.get('usta-auth')?.value

  // Если заходит на /admin без куки — перекидываем на /login
  if (isAdminRoute && cookie !== 'USTA-KOROL-999X') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если уже вошел и пытается зайти в /login — перекидываем в админку
  if (isLoginRoute && cookie === 'USTA-KOROL-999X') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}
