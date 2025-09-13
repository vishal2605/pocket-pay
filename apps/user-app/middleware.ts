import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle CORS preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', '*') // Replace with specific domains in prod
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // 2. Apply CORS to all responses (including redirects)
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*') // Replace with specific domains in prod
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 3. Your existing auth logic (unchanged)
  const sessionToken = request.cookies.get('next-auth.session-token') || 
                      request.cookies.get('__Secure-next-auth.session-token')
  const publicRoutes = ['/signin', '/signup', '/']

  if (sessionToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/user-app/dashboard', request.url))
  }

  if (pathname.startsWith('/user-app') && !sessionToken) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}