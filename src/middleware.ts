import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication
 */
const protectedRoutes = [
  '/profile',
];

/**
 * Routes that should redirect to home if authenticated
 */
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Check if route is auth-only (login/register)
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Get session from cookie
  const session = request.cookies.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  
  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to home if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
