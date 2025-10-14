import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const token = parseAuthCookie(cookieHeader);
  const payload = token ? await verifyJwt(token) : null;

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    username: payload.username,
    isAdmin: payload.isAdmin,
  });
}
