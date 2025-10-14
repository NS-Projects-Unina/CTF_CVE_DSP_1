import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export type JwtPayload = { username: string; isAdmin: boolean };

const SECRET = process.env.JWT_SECRET || 'changeme-secret';
const encoder = new TextEncoder();
const secretKey = encoder.encode(SECRET);

// 🔹 Crea e restituisce una response con il cookie JWT
export async function createAuthToken(username: string, isAdmin: boolean) {
  const token = await new SignJWT({ username, isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey);

  const response = NextResponse.json({ success: true, message: 'Login effettuato!' });
  response.cookies.set('authToken', token, {
    httpOnly: true,
    path: '/',
    maxAge: 2 * 60 * 60, // 2 ore
    sameSite: 'lax',
  });

  return response;
}

// 🔹 Estrae il token dal cookie header
export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies.authToken || null;
}

// 🔹 Verifica il JWT
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
