const jimpModule = require('jimp');
const path = require('path');

const logoPath = path.join(__dirname, 'public', 'futura_logo.png');

async function processLogo() {
  try {
    let image;
    // Handle different Jimp version exports
    if (typeof jimpModule.read === 'function') {
      image = await jimpModule.read(logoPath);
    } else if (jimpModule.Jimp && typeof jimpModule.Jimp.read === 'function') {
      image = await jimpModule.Jimp.read(logoPath);
    } else if (jimpModule.default && typeof jimpModule.default.read === 'function') {
      image = await jimpModule.default.read(logoPath);
    } else {
      throw new Error('Could not find Jimp.read function. Jimp exports: ' + Object.keys(jimpModule));
    }
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0; 
      } else if (r > 200 && g > 200 && b > 200) {
        const avg = (r + g + b) / 3;
        const alpha = Math.max(0, 255 - ((avg - 200) / 40) * 255);
        this.bitmap.data[idx + 3] = alpha;
      }
    });

    await new Promise((resolve, reject) => {
      image.write(logoPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Successfully removed white background and updated futura_logo.png');
  } catch (error) {
    console.error('❌ Error processing logo:', error);
  }
}

processLogo();
