import sharp from 'sharp';

async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    await sharp('public/seeusoon-logo.jpg')
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(`public/pwa-${size}x${size}.png`);
    
    console.log(`✅ Generated pwa-${size}x${size}.png`);
  }
  
  // Also create favicon
  await sharp('public/seeusoon-logo.jpg')
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico');
  
  console.log('✅ Generated favicon.ico');
}

generateIcons().then(() => {
  console.log('🎉 All icons generated!');
}).catch(err => {
  console.error('Error:', err);
});
