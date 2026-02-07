import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log(`[MIDDLEWARE] Checking path: ${request.nextUrl.pathname}`);
    // Check if accessing /vendor
    if (request.nextUrl.pathname.startsWith('/vendor')) {
        // Allow /vendor/login
        if (request.nextUrl.pathname === '/vendor/login') {
            return NextResponse.next();
        }

        // Check cookie
        const authCookie = request.cookies.get('vendor_auth');

        if (!authCookie) {
            return NextResponse.redirect(new URL('/vendor/login', request.url));
        }
    }

    return NextResponse.next();
}

// Match all request paths except for the ones starting with:
// - api (API routes)
// - _next/static (static files)
// - _next/image (image optimization files)
// - favicon.ico (favicon file)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
