import { chromium, artifactPath, baseURL, qaRequire } from './runtime.mjs';
const { default: lighthouse } = await import(qaRequire.resolve('lighthouse'));
const { default: desktopConfig } = await import(
  qaRequire.resolve('lighthouse/core/config/desktop-config.js')
);
const { launch } = await import(qaRequire.resolve('chrome-launcher'));
import { writeFile } from 'node:fs/promises';
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless', '--no-sandbox'],
});
try {
  const output = [];
  for (const formFactor of ['mobile', 'desktop']) {
    const result = await lighthouse(
      baseURL,
      {
        port: chrome.port,
        output: 'json',
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
      formFactor === 'desktop' ? desktopConfig : undefined
    );
    await writeFile(
      artifactPath(`lighthouse-${formFactor}.json`),
      JSON.stringify(result.lhr, null, 2)
    );
    output.push({
      formFactor,
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([k, v]) => [
          k,
          v.score * 100,
        ])
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
          'speed-index',
        ].map((k) => [k, result.lhr.audits[k].displayValue])
      ),
      opportunities: Object.values(result.lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9)
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.displayValue,
        })),
    });
  }
  console.log(JSON.stringify(output, null, 2));
} finally {
  await chrome.kill();
}
