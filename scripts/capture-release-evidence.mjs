import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'outputs', 'release-v1');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu-rasterization'],
  });

  // 1. Capture 1440px Desktop
  console.log('Capturing 1440px desktop...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // Full page
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-preprod-1440.png'),
      fullPage: true,
    });

    // Focused Hero at 1440px
    const heroEl = await page.$('#hero');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(OUTPUT_DIR, 'hero-preprod-1440.png') });
    }

    // Focused Evidence States
    const statesEl = await page.$('#evidence-states');
    if (statesEl) {
      await statesEl.screenshot({ path: path.join(OUTPUT_DIR, 'evidence-states-preprod.png') });
    }

    // Focused Evidence Brief Preview
    const briefEl = await page.$('#evidence-brief');
    if (briefEl) {
      await briefEl.screenshot({ path: path.join(OUTPUT_DIR, 'evidence-brief-preprod.png') });
    }

    // Evidence Brief Modal
    const briefBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('See an Evidence Brief')) || null;
    });
    if (briefBtn && briefBtn.asElement()) {
      await briefBtn.asElement().click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence-brief-modal-preprod.png') });
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 400));
    }

    await page.close();
  }

  // 2. Capture 375px Mobile
  console.log('Capturing 375px mobile...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // Full page mobile
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-preprod-375.png'),
      fullPage: true,
    });

    // Focused Mobile Hero
    const heroEl = await page.$('#hero');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(OUTPUT_DIR, 'hero-mobile-preprod-375.png') });
    }

    await page.close();
  }

  await browser.close();
  console.log('All release QA screenshots captured in:', OUTPUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
