// app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { parse } from 'cookie';
import { verifyJwt } from '@/app/lib/auth';

const PROJECT_ROOT = process.cwd();

export async function GET(req: NextRequest) {
  try {
    // 1) auth (mantenuta per completezza)
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader || '');
    const token = cookies.authToken;
    const payload = token ? await verifyJwt(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // 2) prendi parametro filename da query
    const url = new URL(req.url);
    const raw = url.searchParams.get('file');

    if (!raw) return NextResponse.json({ error: 'Parametro file mancante' }, { status: 400 });

    const cleanRaw = raw.startsWith('/') ? raw.substring(1) : raw;

    const filePath = path.join(PROJECT_ROOT, cleanRaw);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File non trovato' }, { status: 404 });
    }

    // 5) leggi e rispondi con il file
    const data = await fs.promises.readFile(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const filename = path.basename(raw);

    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Download error', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}