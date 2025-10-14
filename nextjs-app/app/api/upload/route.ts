// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'cookie';
import { verifyJwt } from '@/app/lib/auth'; // usa il verifyJwt che abbiamo definito (jose)

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images');

// Create folder if missing (startup)
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export async function POST(req: NextRequest) {
  try {
    // 1) verifica autenticazione (cookie HttpOnly 'authToken')
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader || '');
    const token = cookies.authToken;
    const payload = token ? await verifyJwt(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // 2) leggi form-data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nessun file inviato' }, { status: 400 });
    }

    // 3) validazioni base: size e tipo (opzionale)
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    const fileSize = file.size ?? 0;
    if (fileSize > MAX_BYTES) {
      return NextResponse.json({ error: 'File troppo grande (max 5MB)' }, { status: 413 });
    }

    // 4) sanitizza filename e previeni collisioni
    const originalName = (file as any).name ?? 'upload';
    // rimuovi caratteri pericolosi
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    const finalName = `${uniqueSuffix}_${safeName}`;

    // 5) salva nel filesystem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outPath = path.join(UPLOAD_DIR, finalName);

    // sicurezza extra: controlla che outPath sia all'interno di UPLOAD_DIR
    if (!outPath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await fs.promises.writeFile(outPath, buffer, { flag: 'wx' });

    // 6) ritorna informazioni
    return NextResponse.json({ success: true, file: finalName, originalName });
  } catch (err) {
    console.error('Upload error', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
