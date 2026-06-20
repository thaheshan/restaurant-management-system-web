import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });

    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filePath = path.join(process.cwd(), 'public', 'futura_logo.png');
    fs.writeFileSync(filePath, buffer);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
