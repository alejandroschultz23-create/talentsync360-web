import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROD_URL = 'https://www.talentsync360.com';

async function testCTAs() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Intercept navigation so clicks don't leave the page
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.isNavigationRequest() && req.frame() === page.mainFrame() && req.url() !== PROD_URL && !req.url().startsWith(PROD_URL)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.evaluateOnNewDocument(() => {
    window.capturedEvents = [];
    window.dataLayer = window.dataLayer || [];
    const orig = window.dataLayer.push;
    window.dataLayer.push = function(...args) {
      window.capturedEvents.push(...args);
      return orig.apply(this, args);
    };
  });

  // Test 1: Hero "Validate a Role"
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.capturedEvents = [];
      window.dataLayer = window.dataLayer || [];
      const orig = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        window.capturedEvents.push(...args);
        return orig.apply(this, args);
      };
    });
    await page.goto(PROD_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const link = document.querySelector('#hero a[href*="validate-role"]');
      if (link) link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await new Promise(r => setTimeout(r, 400));
    const evs = await page.evaluate(() => window.capturedEvents);
    console.log('Hero Validate a Role event:', evs.filter(e => e.event === 'click_contact'));
    await page.close();
  }

  // Test 2: Hero "Review my evidence"
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.capturedEvents = [];
      window.dataLayer = window.dataLayer || [];
      const orig = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        window.capturedEvents.push(...args);
        return orig.apply(this, args);
      };
    });
    await page.goto(PROD_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const link = document.querySelector('#hero a[href*="evidence-review"]');
      if (link) link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await new Promise(r => setTimeout(r, 400));
    const evs = await page.evaluate(() => window.capturedEvents);
    console.log('Hero Review my evidence event:', evs.filter(e => e.event === 'click_start_evidence_review'));
    await page.close();
  }

  // Test 3: Hero "See an Evidence Brief"
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.capturedEvents = [];
      window.dataLayer = window.dataLayer || [];
      const orig = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        window.capturedEvents.push(...args);
        return orig.apply(this, args);
      };
    });
    await page.goto(PROD_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#hero button')).find(b => b.textContent.includes('See an Evidence Brief'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const evs = await page.evaluate(() => window.capturedEvents);
    console.log('Hero See an Evidence Brief event:', evs.filter(e => e.event === 'click_see_evidence_brief'));
    await page.close();
  }

  await browser.close();
}

testCTAs().catch(e => {
  console.error(e);
  process.exit(1);
});
