const PROD_URL = 'https://www.talentsync360.com';
const EXPECTED_TITLE = 'Evidence-Backed LATAM Technical Hiring | TalentSync360';

async function check() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(PROD_URL, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
      console.log(`[Attempt ${i + 1}] Status: ${res.status}, Title: "${title}", x-vercel-id: ${res.headers.get('x-vercel-id')}`);
      if (title === EXPECTED_TITLE) {
        console.log('SUCCESS: Live production has deployed new SEO metadata!');
        process.exit(0);
      }
    } catch (e) {
      console.log(`[Attempt ${i + 1}] Error:`, e.message);
    }
    await new Promise(r => setTimeout(r, 6000));
  }
  console.log('Timeout waiting for title update.');
  process.exit(1);
}

check();
