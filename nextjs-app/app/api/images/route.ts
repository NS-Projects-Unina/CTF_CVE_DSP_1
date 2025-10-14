import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UP = path.join(process.cwd(),'public','images');

export async function GET(){
  if(!fs.existsSync(UP)) return NextResponse.json([]);
  const list = fs.readdirSync(UP).filter(f=>!f.startsWith('.'));
  return NextResponse.json(list);
}
