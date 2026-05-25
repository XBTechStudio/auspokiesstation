import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected domains list
const PROTECTED_DOMAINS = [
  'xbtech19.site',
  'www.xbtech19.site',
  'xbtech19.shop',
  'www.xbtech19.shop',
  '19.xbtech.my',
];

// Cookie name for access grant
const ACCESS_COOKIE_NAME = 'access_granted';

// Cookie expiration time (24 hours in seconds)
const COOKIE_MAX_AGE = 24 * 60 * 60;

export function middleware(request: NextRequest) {
  // Get the host from headers (support reverse proxy scenarios)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  
  // Extract domain without port
  const domain = host.split(':')[0].toLowerCase();
  
  // Check if the domain is in the protected list
  const isProtectedDomain = PROTECTED_DOMAINS.some(protectedDomain => 
    domain === protectedDomain.toLowerCase()
  );
  
  // If not a protected domain, allow access
  if (!isProtectedDomain) {
    return NextResponse.next();
  }
  
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Allow access to password page and API routes
  if (pathname === '/access-password' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if access cookie exists and is valid
  const accessCookie = request.cookies.get(ACCESS_COOKIE_NAME);
  
  if (!accessCookie || accessCookie.value !== 'true') {
    // Redirect to password page
    const url = request.nextUrl.clone();
    url.pathname = '/access-password';
    // Preserve the original URL as a query parameter for redirect after authentication
    if (pathname !== '/') {
      url.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(url);
  }
  
  // Access granted, allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
