import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'outputs', 'homepage-prototype-v1');

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

  // 1. Capture Full Page at 1440px
  console.log('Capturing 1440px full page...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000)); // allow WebGL / font stabilization
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-full-1440.png'),
      fullPage: true,
    });

    // Focused A: Hero at 1440px
    const heroEl = await page.$('section:first-of-type');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(OUTPUT_DIR, 'focused-a-hero-1440.png') });
    }

    // Focused B: Evidence States Section
    const statesHandle = await page.$('#evidence-states');
    if (statesHandle) {
      // Temporarily hide fixed nav for clean section screenshot
      await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (nav) nav.style.display = 'none';
      });
      await statesHandle.screenshot({ path: path.join(OUTPUT_DIR, 'focused-b-evidence-states.png') });
      await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (nav) nav.style.display = '';
      });
    }

    // Focused C: Evidence Brief Preview (Section 9)
    const briefHandle = await page.evaluateHandle(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const target = headings.find(h => h.textContent.includes('The Candidate Evidence Brief'));
      return target ? target.closest('section') : null;
    });
    if (briefHandle && briefHandle.asElement()) {
      await briefHandle.asElement().screenshot({ path: path.join(OUTPUT_DIR, 'focused-c-evidence-brief-preview.png') });
    }

    // Focused D: Evidence Brief Modal Desktop
    // Click "See an Evidence Brief" in Hero
    const briefBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('See an Evidence Brief')) || null;
    });
    if (briefBtn && briefBtn.asElement()) {
      await briefBtn.asElement().click();
      await new Promise(r => setTimeout(r, 600)); // wait for modal transition
      // Capture modal viewport
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'focused-d-evidence-brief-modal-desktop.png') });
      // Close modal
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 400));
    }

    await page.close();
  }

  // 2. Capture Full Page at 1280px
  console.log('Capturing 1280px full page...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-full-1280.png'),
      fullPage: true,
    });
    await page.close();
  }

  // 3. Capture Full Page at 768px (Tablet)
  console.log('Capturing 768px tablet full page...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-full-768.png'),
      fullPage: true,
    });
    await page.close();
  }

  // 4. Capture Full Page at 375px (Mobile Portrait)
  console.log('Capturing 375px mobile full page...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'homepage-full-375.png'),
      fullPage: true,
    });

    // Focused E: Hero + mobile fallback at 375px
    const heroElMobile = await page.$('section:first-of-type');
    if (heroElMobile) {
      await heroElMobile.screenshot({ path: path.join(OUTPUT_DIR, 'focused-e-hero-mobile-375.png') });
    }

    // Focused F: Evidence Brief mobile presentation (modal or section)
    // Click modal trigger
    const briefBtnMobile = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('See an Evidence Brief')) || null;
    });
    if (briefBtnMobile && briefBtnMobile.asElement()) {
      await briefBtnMobile.asElement().click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'focused-f-evidence-brief-mobile-modal.png') });
    }

    await page.close();
  }

  // 5. Performance Web Vitals Measurement via PerformanceObserver in Real Chrome
  console.log('Running Performance Web Vitals Audit in Chrome...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Inject Performance Observer script before load
    await page.evaluateOnNewDocument(() => {
      window.__webVitals = {
        lcp: null,
        cls: 0,
        fid: null,
        inp: null,
        navTiming: null,
      };

      // LCP Observer
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          window.__webVitals.lcp = lastEntry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS Observer
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__webVitals.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000)); // wait for full paint & settling

    // Simulate interactions for INP measurement
    await page.mouse.move(720, 450);
    await page.mouse.click(720, 450);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await new Promise(r => setTimeout(r, 500));

    const vitals = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        lcpMs: window.__webVitals.lcp,
        cls: window.__webVitals.cls,
        nav: nav ? {
          domInteractive: nav.domInteractive,
          domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
          loadEventEnd: nav.loadEventEnd,
          transferSize: nav.transferSize,
        } : null
      };
    });

    console.log('Measured Lab Web Vitals:', JSON.stringify(vitals, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'web-vitals.json'), JSON.stringify(vitals, null, 2));

    await page.close();
  }

  await browser.close();
  console.log('All screenshots and measurements captured in:', OUTPUT_DIR);
}

run().catch((err) => {
  console.error('Error running capture script:', err);
  process.exit(1);
});
