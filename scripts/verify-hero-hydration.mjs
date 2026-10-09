import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

// Baseline: node scripts/verify-hero-hydration.mjs base http://127.0.0.1:3103
// Fixed:    node scripts/verify-hero-hydration.mjs after http://127.0.0.1:3101
const [phase, address] = process.argv.slice(2);
assert.ok(['base', 'after'].includes(phase));
const base = new URL(address);
assert.equal(base.protocol, 'http:');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname));
const output = path.resolve(`outputs/hero-hydration/${phase}`);
assert.ok(!fs.existsSync(output), 'Existing evidence must be preserved');
fs.mkdirSync(output, { recursive: true });
const result = { phase, address, scenarios: [], blockedExternalRequests: 0, unexpectedMutations: [] };
const browser = await puppeteer.launch({
  executablePath: process.env.STAGE1_BROWSER_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

try {
  for (const language of ['en', 'es']) {
    for (const mode of ['desktop', 'mobile', 'reduced-motion', 'no-webgl']) {
      const page = await browser.newPage();
      const width = mode === 'mobile' ? 375 : 1440;
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewport({ width, height: width === 375 ? 812 : 1000 });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: mode === 'reduced-motion' ? 'reduce' : 'no-preference' }]);
      await page.evaluateOnNewDocument((lang, disableWebGL) => {
        localStorage.setItem('ts360-lang', lang);
        if (disableWebGL) {
          const getContext = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, ...options) {
            return ['webgl', 'webgl2', 'experimental-webgl'].includes(type)
              ? null : getContext.call(this, type, ...options);
          };
        }
      }, language, mode === 'no-webgl');
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (new URL(request.url()).origin !== base.origin) {
          result.blockedExternalRequests += 1;
          return request.abort();
        }
        if (!['GET', 'HEAD'].includes(request.method())) {
          result.unexpectedMutations.push(`${request.method()} ${request.url()}`);
          return request.abort();
        }
        return request.continue();
      });
      await page.goto(base.href, { waitUntil: 'networkidle0' });
      await page.waitForFunction((lang) => localStorage.getItem('ts360-lang') === lang && document.querySelector('#hero'), {}, language);
      const selector = mode === 'desktop'
        ? '#hero [aria-label="Interactive 3D representation of LATAM technical engineering talent and role context"]'
        : '#hero [data-testid="hero-globe-fallback"]';
      await page.waitForSelector(selector);
      if (mode === 'desktop') await page.waitForSelector(`${selector} canvas`);
      const globe = await page.$(selector);
      await globe.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      const settledMarkup = await globe.evaluate((element) => element.outerHTML);
      const geometry = await globe.boundingBox();
      assert.ok(geometry?.width > 0 && geometry?.height > 0);
      await globe.screenshot({ path: path.join(output, `${language}-${mode}.png`) });

      let dragBehavior;
      if (mode !== 'desktop') {
        dragBehavior = await globe.evaluate((element) => {
          const options = { bubbles: true, pointerId: 1, isPrimary: true, clientX: 100, clientY: 100 };
          element.dispatchEvent(new PointerEvent('pointerdown', options));
          element.dispatchEvent(new PointerEvent('pointermove', { ...options, clientX: 140, clientY: 120 }));
          return new Promise((resolve) => requestAnimationFrame(() => {
            const moved = element.style.transform;
            element.dispatchEvent(new PointerEvent('pointerup', options));
            requestAnimationFrame(() => resolve({ moved, released: element.style.transform, touchAction: element.style.touchAction }));
          }));
        });
        assert.equal(dragBehavior.touchAction, 'pan-y');
        assert.equal(dragBehavior.released, '');
        if (mode === 'reduced-motion') assert.equal(dragBehavior.moved, '');
        else assert.ok(dragBehavior.moved.includes('perspective(800px)'));
      }
      const hydrationErrors = errors.filter((message) => /#418|Hydration failed/i.test(message));
      result.scenarios.push({ language, mode, width, errors, hydrationErrors, geometry, settledMarkup, dragBehavior });
      await page.close();
    }
  }
  assert.deepEqual(result.unexpectedMutations, []);
  if (phase === 'base') {
    for (const scenario of result.scenarios) {
      assert.equal(scenario.hydrationErrors.length, scenario.mode === 'desktop' ? 0 : 1,
        `${scenario.language}/${scenario.mode}: baseline must reproduce the mismatch`);
      assert.equal(scenario.errors.length, scenario.hydrationErrors.length);
    }
    result.preexistingConfirmed = true;
  } else {
    const before = JSON.parse(fs.readFileSync(path.resolve('outputs/hero-hydration/base/result.json'), 'utf8'));
    for (const scenario of result.scenarios) {
      assert.deepEqual(scenario.errors, [], `${scenario.language}/${scenario.mode}`);
      const previous = before.scenarios.find((item) => item.language === scenario.language && item.mode === scenario.mode);
      assert.equal(scenario.settledMarkup, previous.settledMarkup, 'Settled visual DOM must remain unchanged');
      assert.deepEqual(scenario.geometry, previous.geometry, 'Globe geometry must remain unchanged');
      assert.deepEqual(scenario.dragBehavior, previous.dragBehavior, 'Fallback interactions must remain unchanged');
    }
    result.visualDomAndInteractionUnchanged = true;
  }
  result.ok = true;
} catch (error) {
  result.ok = false;
  result.failure = error.stack;
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ output, ok: result.ok, scenarios: result.scenarios.map(({ language, mode, errors }) => ({ language, mode, errors })), failure: result.failure }, null, 2));
}
