import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('landing page publishes valid free WebApplication structured data', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'JSON-LD script is present');
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'WebApplication');
  assert.equal(data.name, 'GitFolio');
  assert.equal(data.operatingSystem, 'Web');
  assert.equal(data.isAccessibleForFree, true);
  assert.equal(data.offers.price, '0');
  assert.equal(data.url, 'https://gitfolio.prudhvicharan.com/');
  assert.equal(data.codeRepository, 'https://github.com/Prudhvicharan/gitfolio');
});

test('public SEO and sharing metadata use the canonical custom domain', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const domain = 'https://gitfolio.prudhvicharan.com';

  assert.match(html, new RegExp(`<link rel="canonical" href="${domain}/"`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${domain}/"`));
  assert.match(html, new RegExp(`property="og:image"\\s+content="${domain}/social-preview\\.png"`));
  assert.match(html, new RegExp(`name="twitter:image"\\s+content="${domain}/social-preview\\.png"`));
  assert.doesNotMatch(html, /gitfolio-eight\.vercel\.app/);
});
