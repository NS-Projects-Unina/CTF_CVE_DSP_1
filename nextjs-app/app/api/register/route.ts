import { NextRequest, NextResponse } from 'next/server';
import { addUser } from '../../lib/users';

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();
  if (!user || !pass) return NextResponse.json('Username e password richiesti', { status: 400 });

  const success = addUser(user, pass);
  if (!success) return NextResponse.json('Username già esistente', { status: 409 });

  return NextResponse.json('Registrazione completata!');
}
