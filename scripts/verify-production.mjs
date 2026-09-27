import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROD_URL = 'https://www.talentsync360.com';
const OUTPUT_DIR = path.resolve(process.cwd(), 'outputs', 'release-v1');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function verify() {
  console.log('--- PRODUCTION HTML & SEO AUDIT ---');
  const res = await fetch(PROD_URL, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();

  console.log('HTTP Status:', res.status);
  console.log('Deployment Header (x-vercel-id):', res.headers.get('x-vercel-id'));
  console.log('Date:', res.headers.get('date'));
  console.log('Age:', res.headers.get('age'));

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NONE');

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  console.log('Description:', descMatch ? descMatch[1] : 'NONE');

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'NONE');

  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  console.log('Robots:', robotsMatch ? robotsMatch[1] : 'NONE');

  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H1 Count:', h1Matches.length);
  h1Matches.forEach((h1, i) => console.log(`H1 [${i + 1}]: "${h1}"`));

  console.log('Organization Schema present:', html.includes('"@type":"Organization"'));
  console.log('FAQPage Schema present:', html.includes('"@type":"FAQPage"'));
  console.log('Has CONFLICT state:', html.includes('CONFLICT'));
  console.log('Has SUPPORTED state:', html.includes('SUPPORTED'));
  console.log('Has PARTIAL state:', html.includes('PARTIAL'));
  console.log('Has UNKNOWN state:', html.includes('UNKNOWN'));
  console.log('Has NEEDS VALIDATION state:', html.includes('NEEDS VALIDATION') || html.includes('NEEDS_VALIDATION'));

  console.log('\n--- BROWSER VERIFICATION WITH PUPPETEER ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu-rasterization'],
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('requestfailed', req => {
    networkErrors.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  // Track dataLayer events
  await page.evaluateOnNewDocument(() => {
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push;
    window.capturedEvents = [];
    window.dataLayer.push = function(...args) {
      window.capturedEvents.push(...args);
      return originalPush.apply(this, args);
    };
  });

  // Desktop 1440px
  console.log('Navigating to production at 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const response = await page.goto(PROD_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  console.log('Production Page Response Code:', response.status());

  await new Promise(r => setTimeout(r, 2000)); // Allow Three.js globe to initialize

  // Check WebGL Canvas in Hero
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('#hero canvas');
    if (!canvas) return { found: false };
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return {
      found: true,
      width: canvas.width,
      height: canvas.height,
      hasContext: !!gl,
    };
  });
  console.log('Desktop Hero WebGL Canvas:', canvasInfo);

  // Check DOM for 5 States in Section 7
  const statesInDOM = await page.evaluate(() => {
    const sec = document.querySelector('#evidence-states');
    if (!sec) return [];
    return Array.from(sec.querySelectorAll('[role="status"]')).map(el => el.textContent.trim());
  });
  console.log('Section 7 States in live DOM:', statesInDOM);

  // Check 3 Problem Pillars in Section 2
  const problemPillars = await page.evaluate(() => {
    const sec = document.querySelector('#problem');
    if (!sec) return [];
    return Array.from(sec.querySelectorAll('h3')).map(h => h.textContent.trim());
  });
  console.log('Section 2 Pillars in live DOM:', problemPillars);

  // Check Section 3 Stages
  const pipelineStages = await page.evaluate(() => {
    const sec = document.querySelector('#product-transformation');
    if (!sec) return [];
    return Array.from(sec.querySelectorAll('.font-semibold, .font-bold'))
      .map(el => el.textContent.trim())
      .filter(t => t.includes('Role Context') || t.includes('Evidence') || t.includes('Brief') || t.includes('Interview'));
  });
  console.log('Section 3 Pipeline in live DOM:', pipelineStages);

  // Take Production Screenshots
  console.log('Capturing production screenshots...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'production-home-1440.png'), fullPage: true });

  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(OUTPUT_DIR, 'production-hero-1440.png') });
  }

  const statesEl = await page.$('#evidence-states');
  if (statesEl) {
    await statesEl.screenshot({ path: path.join(OUTPUT_DIR, 'production-evidence-states.png') });
  }

  const briefEl = await page.$('#evidence-brief');
  if (briefEl) {
    await briefEl.screenshot({ path: path.join(OUTPUT_DIR, 'production-evidence-brief.png') });
  }

  // Test Analytics & Modal: Click "See an Evidence Brief" in Hero
  console.log('Testing "See an Evidence Brief" button click in Hero...');
  const briefBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('#hero button'));
    return btns.find(b => b.textContent.includes('See an Evidence Brief')) || null;
  });
  if (briefBtn && briefBtn.asElement()) {
    await briefBtn.asElement().click();
    await new Promise(r => setTimeout(r, 600));

    // Capture modal open
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'production-evidence-brief-modal.png') });

    // Check modal visibility
    const modalVisible = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return !!dialog && window.getComputedStyle(dialog).display !== 'none';
    });
    console.log('Evidence Brief Modal visible after click:', modalVisible);

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // Check captured dataLayer events
  const capturedGTM = await page.evaluate(() => window.capturedEvents || []);
  console.log('Captured GTM Events after Hero interaction:', capturedGTM);

  // Mobile 375px
  console.log('Testing mobile 375px...');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(PROD_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Check Mobile Fallback (No WebGL canvas, fallback visible)
  const mobileCanvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('#hero canvas');
    const fallback = document.querySelector('#hero-fallback') || document.querySelector('[aria-label*="LATAM"]');
    return {
      hasCanvas: !!canvas,
      hasFallback: !!fallback,
    };
  });
  console.log('Mobile Hero Fallback Check:', mobileCanvasInfo);

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'production-home-375.png'), fullPage: true });

  console.log('\n--- CONSOLE & HYDRATION ERROR REPORT ---');
  console.log('Console Errors:', consoleErrors);
  console.log('Network Failures:', networkErrors);

  await browser.close();
  console.log('--- PRODUCTION VERIFICATION COMPLETE ---');
}

verify().catch(e => {
  console.error('Verification failed:', e);
  process.exit(1);
});
