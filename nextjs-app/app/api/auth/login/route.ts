import { NextRequest } from 'next/server';
import { db } from '@/app/lib/db';
import { createAuthToken } from '@/app/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();

  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(user);
  if (!row) {
    return Response.json({ success: false, message: 'Utente non trovato' }, { status: 401 });
  }

  const valid = await bcrypt.compare(pass, row.password);
  if (!valid) {
    return Response.json({ success: false, message: 'Password errata' }, { status: 401 });
  }

  // ✅ crea cookie JWT e ritorna la response
  return createAuthToken(row.username, !!row.isAdmin);
}
