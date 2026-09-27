import fs from 'fs';
import path from 'path';

const p = path.join('.next', 'server', 'app', 'index.html');
if (fs.existsSync(p)) {
  const html = fs.readFileSync(p, 'utf8');
  console.log('Title:', html.match(/<title>([^<]+)<\/title>/)?.[1]);
  console.log('Desc:', html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]);
  console.log('Canonical:', html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]);
  console.log('OG Title:', html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1]);
  console.log('OG Desc:', html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]);
  console.log('Twitter Card:', html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i)?.[1]);
  console.log('H1:', html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '')?.trim());

  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  console.log('JSON-LD Blocks Count:', jsonLdMatches.length);
  jsonLdMatches.forEach((m, idx) => {
    try {
      const data = JSON.parse(m[1]);
      console.log(`Schema [${idx + 1}]:`, data['@type']);
      if (data['@type'] === 'Organization') {
        console.log('  Org Description:', data.description);
      }
      if (data['@type'] === 'FAQPage') {
        console.log('  FAQ Count:', data.mainEntity?.length);
        data.mainEntity?.forEach((q, qi) => {
          console.log(`    Q${qi + 1}: ${q.name}`);
        });
      }
    } catch (e) {
      console.error('Error parsing JSON-LD:', e);
    }
  });
  console.log('File not found, directory listing:');
  console.log(fs.readdirSync(path.join('.next', 'server', 'app')));
}
