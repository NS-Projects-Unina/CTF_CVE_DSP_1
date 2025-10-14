import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import sharp from 'sharp';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images');

export async function POST(req: NextRequest) {
  try {
    const { file, operation, params } = await req.json();

    // Validazione base
    if (!file || !operation || !params) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }
    const inputPath = path.join(UPLOAD_DIR, file);
    if (!fs.existsSync(inputPath)) {
      return NextResponse.json({ error: 'File di input non trovato' }, { status: 404 });
    }

    let outputPath = '';
    let responseMessage = '';

    // Switch per gestire le diverse operazioni
    switch (operation) {
      case 'crop':
        outputPath = path.join(UPLOAD_DIR, `cropped-${file}`);
        await sharp(inputPath)
          .extract({
            left: 0, top: 0,
            width: parseInt(params.width) || 100,
            height: parseInt(params.height) || 100,
          })
          .toFile(outputPath);
        responseMessage = `Crop applicato con successo a ${file}.`;
        break;

      case 'rotate':
        outputPath = path.join(UPLOAD_DIR, `rotated-${file}`);
        await sharp(inputPath)
          .rotate(parseInt(params.angle) || 90)
          .toFile(outputPath);
        responseMessage = `Rotazione di ${params.angle} gradi applicata a ${file}.`;
        break;

      case 'resize':
        const newWidth = params.width; 
        outputPath = path.join(UPLOAD_DIR, `resized-${file}`);
        const command = `convert "${inputPath}" -resize ${newWidth} "${outputPath}"`;
        return new Promise<NextResponse>((resolve) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              resolve(NextResponse.json({ error: 'Errore durante il resize legacy', details: stderr }, { status: 500 }));
              return;
            }
            resolve(NextResponse.json({ message: `Resize legacy completato. Output: ${stdout}` }));
          });
        });

      default:
        return NextResponse.json({ error: 'Operazione non valida' }, { status: 400 });
    }

    return NextResponse.json({ message: responseMessage });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Errore interno del server', details: err.message }, { status: 500 });
  }
}