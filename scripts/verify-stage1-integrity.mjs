import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { translations } from '../src/context/translations.ts';

// Run with: node --import tsx scripts/verify-stage1-integrity.mjs
// Only a local server is allowed. Every contact POST is intercepted before it
// reaches the server; external resources and unexpected mutations are blocked.
const base = new URL(process.env.STAGE1_BASE_URL ?? 'http://127.0.0.1:3101');
assert.equal(base.protocol, 'http:');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Local server required');
const output = path.resolve(`outputs/stage1-integrity-${new Date().toISOString().replace(/[:.]/g, '-')}`);
assert.ok(!fs.existsSync(output), 'Use a fresh output directory; existing evidence is preserved');
fs.mkdirSync(output, { recursive: true });
const result = { checks: [], contactPayloads: [], blockedExternalRequests: 0, errors: [], unexpectedMutations: [] };

async function clickText(page, text, scope = 'body') {
  const handle = await page.evaluateHandle((label, selector) =>
    [...document.querySelectorAll(`${selector} button`)].find((button) => button.textContent.trim() === label),
  text, scope);
  const button = handle.asElement();
  assert.ok(button, `Button missing: ${text}`);
  await button.click();
  await handle.dispose();
}

const browser = await puppeteer.launch({
  executablePath: process.env.STAGE1_BROWSER_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

try {
  for (const language of ['en', 'es']) {
    for (const width of [1440, 375]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: width === 375 ? 812 : 1000 });
      await page.evaluateOnNewDocument((lang) => localStorage.setItem('ts360-lang', lang), language);
      page.on('pageerror', (error) => result.errors.push({
        language, width, url: page.url(), message: error.message,
      }));
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.origin !== base.origin) {
          result.blockedExternalRequests += 1;
          return request.abort();
        }
        if (request.method() === 'POST' && url.pathname === '/api/send') {
          result.contactPayloads.push(JSON.parse(request.postData()));
          return request.respond({ status: 200, contentType: 'application/json', body: '{"success":true}' });
        }
        if (!['GET', 'HEAD'].includes(request.method())) {
          result.unexpectedMutations.push(`${request.method()} ${url.pathname}`);
          return request.abort();
        }
        return request.continue();
      });
      const copy = translations[language];
      await page.goto(base.href, { waitUntil: 'networkidle0' });
      await page.waitForFunction((notice) => document.body.innerText.includes(notice), {}, copy.homepage.candidateReviewPreview.demoNotice);
      const boundary = copy.homepage.candidateReviewPreview.sharingBoundary;
      assert.ok((await page.$eval('#talents', (el) => el.innerText)).includes(boundary));
      await clickText(page, copy.homepage.candidateReviewPreview.optInTogglePrivate, '#talents');
      await page.waitForFunction((text) => document.body.innerText.includes(text), {}, copy.homepage.candidateReviewPreview.optInDescriptionActive);
      assert.ok((await page.$eval('#talents', (el) => el.innerText)).includes(boundary));
      await clickText(page, copy.homepage.candidateReviewPreview.optInToggleActive, '#talents');

      const evidenceBefore = await page.$eval('#partners .bg-slate-50\\/30', (el) => el.innerText);
      await clickText(page, copy.homepage.partnerToggle.tabPartner, '#partners');
      assert.equal(await page.$eval('#partners .bg-slate-50\\/30', (el) => el.innerText), evidenceBefore);
      assert.ok((await page.$eval('#partners', (el) => el.innerText)).includes(copy.homepage.partnerToggle.disclaimer));
      await clickText(page, copy.homepage.partnerToggle.tabStandard, '#partners');
      assert.ok(!(await page.$eval('#partners', (el) => el.innerText)).includes('Verified Brief'));
      result.checks.push(`${language}/${width}: simulation toggles and sharing boundary`);

      await page.goto(new URL('/companies', base).href, { waitUntil: 'networkidle0' });
      await clickText(page, copy.companies.productProof.fullInteractiveView);
      await page.waitForSelector('[role="dialog"]');
      const dialog = await page.$eval('[role="dialog"]', (el) => el.innerText);
      assert.ok(dialog.includes(copy.companies.productProof.modalContextNotice));
      assert.ok(dialog.includes(copy.homepage.deliverable.targetRoleValue));
      assert.ok(dialog.includes('REF: AR-8821'));
      await page.screenshot({ path: path.join(output, `companies-modal-${language}-${width}.png`) });
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      result.checks.push(`${language}/${width}: separate sample context, mobile reference and Escape`);

      if (width === 1440) {
        const intents = language === 'en'
          ? ['free-trial', 'pilot', 'shortlist', 'shortlist-sprint', 'ongoing-partner', 'partner-delivery', 'demo', 'validate-role', null]
          : ['free-trial', 'partner-delivery', null];
        for (const intent of intents) {
          const query = intent ? `?intent=${intent}` : '?tipo=general';
          await page.goto(new URL(`/contact${query}`, base).href, { waitUntil: 'networkidle0' });
          await page.type('#firstName', 'Synthetic');
          await page.type('#lastName', 'Reviewer');
          await page.type('#email', 'stage1@example.test');
          await page.select('#role', copy.contact.optionB2B);
          const message = `Synthetic ${language} review\nKeep this line unchanged.`;
          await page.type('#message', message);
          const expectedCount = result.contactPayloads.length + 1;
          await page.click('button[type="submit"]');
          await page.waitForFunction(() => !document.querySelector('#message'));
          assert.equal(result.contactPayloads.length, expectedCount);
          const payload = result.contactPayloads.at(-1);
          const label = language === 'es' ? 'Intención comercial' : 'Commercial intent';
          assert.equal(payload.message, intent ? `${message}\n\n[${label}: ${intent}]` : message);
          assert.equal(payload.contactType, intent ? 'b2b' : 'general');
          assert.equal(payload.lang, language);
          assert.equal(payload.pageOrigin, '/contact');
          assert.ok(!('intent' in payload), 'Public payload contract must remain unchanged');
          result.checks.push(`${language}: mocked contact ${intent ?? 'legacy general'}`);
        }
      }
      await page.close();
    }
  }
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.unexpectedMutations, []);
  result.ok = true;
} catch (error) {
  result.ok = false;
  result.failure = error.stack;
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ output, ok: result.ok, checks: result.checks.length, interceptedContactPosts: result.contactPayloads.length, failure: result.failure }, null, 2));
}
