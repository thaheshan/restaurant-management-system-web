import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    fs.copyFileSync('C:\\Users\\Thahe\\.gemini\\antigravity\\brain\\4bc7443f-9df7-41d6-84bb-eab4e961a5fd\\splash_bg_1781960547185.png', 'c:\\Users\\Thahe\\Documents\\GitHub\\restaurant-management-system-web\\resourt_management\\public\\splash_bg.png');
    fs.copyFileSync('C:\\Users\\Thahe\\.gemini\\antigravity\\brain\\4bc7443f-9df7-41d6-84bb-eab4e961a5fd\\futura_logo_v2_1781960564437.png', 'c:\\Users\\Thahe\\Documents\\GitHub\\restaurant-management-system-web\\resourt_management\\public\\futura_logo.png');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
