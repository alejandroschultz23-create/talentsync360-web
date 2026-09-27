import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'outputs', 'refinements-v1');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Desktop 1440px
  console.log('Capturing Desktop 1440px...');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Navbar & Hero
  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(OUTPUT_DIR, '01-hero-desktop-1440.png') });
  }

  // Navbar focused screenshot
  const navEl = await page.$('nav');
  if (navEl) {
    await navEl.screenshot({ path: path.join(OUTPUT_DIR, '00-navbar-desktop-1440.png') });
  }

  // Section 2: Problem
  const problemEl = await page.$('#problem');
  if (problemEl) {
    await problemEl.screenshot({ path: path.join(OUTPUT_DIR, '02-problem-desktop-1440.png') });
  }

  // Section 5: Hiring Teams
  const companiesEl = await page.$('#companies');
  if (companiesEl) {
    await companiesEl.screenshot({ path: path.join(OUTPUT_DIR, '05-companies-desktop-1440.png') });
  }

  // Section 6: Technical Professionals
  const talentsEl = await page.$('#talents');
  if (talentsEl) {
    await talentsEl.screenshot({ path: path.join(OUTPUT_DIR, '06-talents-desktop-1440.png') });
  }

  // Section 8: Partner Delivery
  const partnersEl = await page.$('#partners');
  if (partnersEl) {
    await partnersEl.screenshot({ path: path.join(OUTPUT_DIR, '08-partners-desktop-1440.png') });
  }

  // Footer
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: path.join(OUTPUT_DIR, '12-footer-desktop-1440.png') });
  }

  // Test Globe Drag Interaction
  console.log('Testing globe drag interaction...');
  const canvasEl = await page.$('#hero canvas');
  if (canvasEl) {
    const box = await canvasEl.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 120, startY + 20, { steps: 10 });
      await new Promise(r => setTimeout(r, 200));
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 500));
      await heroEl.screenshot({ path: path.join(OUTPUT_DIR, '01-hero-after-drag-interaction.png') });
      console.log('Globe drag screenshot captured successfully!');
    }
  }

  // 2. Mobile 375px
  console.log('Capturing Mobile 375px...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:3005', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  const mobileNav = await mobilePage.$('nav');
  if (mobileNav) {
    await mobileNav.screenshot({ path: path.join(OUTPUT_DIR, '00-navbar-mobile-375.png') });
  }

  const mobileHero = await mobilePage.$('#hero');
  if (mobileHero) {
    await mobileHero.screenshot({ path: path.join(OUTPUT_DIR, '01-hero-mobile-375.png') });
  }

  const mobileProblem = await mobilePage.$('#problem');
  if (mobileProblem) {
    await mobileProblem.screenshot({ path: path.join(OUTPUT_DIR, '02-problem-mobile-375.png') });
  }

  await browser.close();
  console.log('All screenshots captured in:', OUTPUT_DIR);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
