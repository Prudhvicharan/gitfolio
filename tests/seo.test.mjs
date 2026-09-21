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
  assert.equal(data.url, 'https://gitfolio-eight.vercel.app/');
  assert.equal(data.codeRepository, 'https://github.com/Prudhvicharan/gitfolio');
});
