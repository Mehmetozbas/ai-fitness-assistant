import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Public routes
  const publicRoutes = ['/', '/auth/login', '/auth/signup']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - will be handled by NextAuth middleware in auth.ts
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
