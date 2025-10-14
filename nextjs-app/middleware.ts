import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Estrae token dal cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const token = parseAuthCookie(cookieHeader);

  // Verifica token (asincrono)
  const payload = token ? await verifyJwt(token) : null;

  // Rotte protette
  const protectedPaths = ['/upload', '/api/download'];
  const adminPaths = ['/admin', '/api/transform'];

  // 🔒 Se non autenticato e tenta area protetta
  if (protectedPaths.some(p => pathname.startsWith(p)) && !payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // torni dopo il login
    return NextResponse.redirect(loginUrl);
  }

  // 🔒 Se non admin e tenta area admin
  if (adminPaths.some(p => pathname.startsWith(p)) && (!payload || !payload.isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ✅ Autenticato → continua
  return NextResponse.next();
}

export const config = {
  matcher: ['/upload/:path*', '/admin/:path*', '/api/transform/:path*', '/api/download/:path*'],
};
