import { chromium, artifactPath, baseURL, AxeBuilder } from './runtime.mjs';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
await page.goto(baseURL);
await page.evaluate(() => document.fonts.ready);
const results = [];
for (const width of [1440, 1024, 768, 375, 320]) {
  await page.setViewportSize({ width, height: 1000 });
  results.push({
    page: 'home',
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    axe: (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  if ([1440, 375].includes(width))
    await page.screenshot({
      path: artifactPath(`home-${width}.png`),
      fullPage: true,
    });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.getByRole('button', { name: 'Explore a demo' }).click();
await page.getByRole('heading', { name: 'Your work. Your style.' }).waitFor();
results.push({
  page: 'style',
  axe: (
    await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
  ).violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  })),
});
await page.screenshot({
  path: artifactPath('style-desktop.png'),
  fullPage: true,
});
await page.getByRole('button', { name: 'Review content' }).click();
await page.getByRole('heading', { name: 'Make every word yours.' }).waitFor();
results.push({
  page: 'review',
  axe: (
    await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
  ).violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  })),
});
await page.setViewportSize({ width: 375, height: 900 });
await page.screenshot({
  path: artifactPath('review-mobile.png'),
  fullPage: true,
});
await page
  .getByRole('button', { name: 'Preview', exact: true })
  .first()
  .click();
results.push({
  page: 'preview-mobile',
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth
  ),
  axe: (
    await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
  ).violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  })),
});
await page.screenshot({
  path: artifactPath('preview-mobile.png'),
  fullPage: true,
});
await writeFile(
  artifactPath('results.json'),
  JSON.stringify({ results, errors }, null, 2)
);
console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
