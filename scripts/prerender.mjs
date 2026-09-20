import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../dist-ssr/entry-server.js';
const path = new URL('../dist/index.html', import.meta.url);
const html = await readFile(path, 'utf8');
await writeFile(
  path,
  html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
);
console.log(
  'Prerendered landing content for search, sharing, and first paint.'
);
