import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isProfileRoute = pathname.startsWith('/profile');
    const isAdminRoute = pathname.startsWith('/admin');
    const isCheckoutRoute = pathname.startsWith('/checkout') || pathname.startsWith('/cart/checkout');

    if (!token) {
        // Not logged in
        if (isProfileRoute || isAdminRoute || isCheckoutRoute) {
            const url = new URL('/auth/login', request.url);
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    try {
        // Decode JWT payload (base64)
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid token');
        
        // Handle base64url encoding
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);

        const isAdmin = decoded?.role === 'admin';

        // Protect admin routes from non-admins
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL('/profile', request.url));
        }

        // Redirect logged-in users away from auth routes and base /admin
        if (pathname === '/auth/login' || pathname === '/auth/auth/signup' || pathname === '/admin') {
            if (isAdmin) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/profile', request.url));
            }
        }

    } catch (error) {
        // Invalid token
        console.error('Middleware token decode error:', error);
        if (isProfileRoute || isAdminRoute || isCheckoutRoute) {
            const url = new URL('/auth/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
