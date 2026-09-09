import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export const middleware = withAuth(
  function middleware(req) {
    // Protect dashboard and other authenticated routes
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/api/protected/:path*'],
}
