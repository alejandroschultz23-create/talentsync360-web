import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const UPLOADED_PATH = 'C:/Users/aleja/.gemini/antigravity/brain/8702ea6b-3c60-49f8-ab5b-f4dc2b9693f1/.user_uploaded/media_1790528426323.png';

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.goto('file:///' + UPLOADED_PATH);

  const assets = await page.evaluate(() => {
    const img = document.querySelector('img');
    const origCanvas = document.createElement('canvas');
    origCanvas.width = img.naturalWidth;
    origCanvas.height = img.naturalHeight;
    const origCtx = origCanvas.getContext('2d');
    origCtx.drawImage(img, 0, 0);

    // Isotipo: sx: 389, sy: 149, sw: 269, sh: 245
    // Wordmark: sx: 192, sy: 436, sw: 638, sh: 86

    // 1. Isotipo PNG
    const isoCanvas = document.createElement('canvas');
    isoCanvas.width = 269;
    isoCanvas.height = 245;
    const isoCtx = isoCanvas.getContext('2d');
    isoCtx.drawImage(origCanvas, 389, 149, 269, 245, 0, 0, 269, 245);
    const isoData = isoCanvas.toDataURL('image/png');

    // 2. Wordmark PNG
    const wordCanvas = document.createElement('canvas');
    wordCanvas.width = 638;
    wordCanvas.height = 86;
    const wordCtx = wordCanvas.getContext('2d');
    wordCtx.drawImage(origCanvas, 192, 436, 638, 86, 0, 0, 638, 86);
    const wordData = wordCanvas.toDataURL('image/png');

    // 3. Horizontal Lockup PNG
    // Let's create an elegant, perfectly balanced lockup:
    // Target height: 120px
    // Isotipo height: 96px -> width = Math.round(96 * (269 / 245)) = 105px
    // Gap: 28px
    // Wordmark height: 68px -> width = Math.round(68 * (638 / 86)) = 504px
    // Vertical centering:
    // Isotipo y = (120 - 96) / 2 = 12px
    // Wordmark y = (120 - 68) / 2 = 26px
    const targetH = 120;
    const isoH = 96;
    const isoW = Math.round(isoH * (269 / 245)); // 105
    const gap = 24;
    const wordH = 68;
    const wordW = Math.round(wordH * (638 / 86)); // 504
    const totalW = isoW + gap + wordW; // 633

    const horizCanvas = document.createElement('canvas');
    horizCanvas.width = totalW;
    horizCanvas.height = targetH;
    const horizCtx = horizCanvas.getContext('2d');
    horizCtx.imageSmoothingEnabled = true;
    horizCtx.imageSmoothingQuality = 'high';

    // Draw Isotipo
    horizCtx.drawImage(origCanvas, 389, 149, 269, 245, 0, (targetH - isoH) / 2, isoW, isoH);

    // Draw Wordmark
    horizCtx.drawImage(origCanvas, 192, 436, 638, 86, isoW + gap, (targetH - wordH) / 2, wordW, wordH);

    const horizData = horizCanvas.toDataURL('image/png');

    return {
      isoData,
      wordData,
      horizData,
      dimensions: {
        totalW,
        targetH,
        ratio: totalW / targetH
      }
    };
  });

  const publicDir = path.resolve(process.cwd(), 'public');

  fs.writeFileSync(
    path.join(publicDir, 'isotipo.png'),
    Buffer.from(assets.isoData.replace(/^data:image\/png;base64,/, ''), 'base64')
  );

  fs.writeFileSync(
    path.join(publicDir, 'wordmark.png'),
    Buffer.from(assets.wordData.replace(/^data:image\/png;base64,/, ''), 'base64')
  );

  fs.writeFileSync(
    path.join(publicDir, 'logo_horizontal.png'),
    Buffer.from(assets.horizData.replace(/^data:image\/png;base64,/, ''), 'base64')
  );

  console.log('Successfully generated pristine transparent logo assets!');
  console.log('Horizontal lockup dimensions:', assets.dimensions);

  await browser.close();
}

generate().catch(console.error);
