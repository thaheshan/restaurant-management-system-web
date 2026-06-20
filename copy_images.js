const fs = require('fs');
const path = require('path');

const srcLogo = 'C:\\Users\\Thahe\\.gemini\\antigravity\\brain\\4bc7443f-9df7-41d6-84bb-eab4e961a5fd\\futura_logo_v2_1781960564437.png';
const srcSplash = 'C:\\Users\\Thahe\\.gemini\\antigravity\\brain\\4bc7443f-9df7-41d6-84bb-eab4e961a5fd\\splash_bg_1781960547185.png';

const destLogo = path.join(__dirname, 'resourt_management', 'public', 'futura_logo.png');
const destSplash = path.join(__dirname, 'resourt_management', 'public', 'splash_bg.png');

try {
  fs.copyFileSync(srcLogo, destLogo);
  console.log('✅ Successfully copied logo to public folder!');
  
  fs.copyFileSync(srcSplash, destSplash);
  console.log('✅ Successfully copied splash background to public folder!');
} catch (err) {
  console.error('❌ Error copying files:', err.message);
}
