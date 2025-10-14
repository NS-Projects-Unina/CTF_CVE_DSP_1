import { parse } from 'cookie';
import { jwtVerify, type JWTPayload } from 'jose';

export type JwtPayload = { username: string; isAdmin: boolean; iat?: number; exp?: number };

const SECRET = process.env.JWT_SECRET || 'changeme-secret';

// Converte la stringa in un Uint8Array
const encoder = new TextEncoder();
const secretKey = encoder.encode(SECRET);

export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies.authToken || null;
}

// Verifica il JWT con jose
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
