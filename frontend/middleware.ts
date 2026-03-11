import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Allow Fresh Start roadmap without authentication
  if (req.nextUrl.pathname === '/roadmap/fresh-start') {
    return res;
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/generate', '/roadmap', '/profile', '/mentor'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to home
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/generate/:path*', '/roadmap/:path*', '/profile/:path*', '/mentor/:path*'],
};
