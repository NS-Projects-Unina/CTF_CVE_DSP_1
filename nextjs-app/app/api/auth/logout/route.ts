import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('authToken', '', { path: '/', maxAge: 0 }); // elimina cookie
  return res;
}
