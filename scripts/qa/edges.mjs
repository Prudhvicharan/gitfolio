import { chromium, artifactPath, baseURL, AxeBuilder } from './runtime.mjs';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  let imageRequests = 0;
  await page.route('https://capsule-render.vercel.app/**', (route) => {
    imageRequests++;
    return route.fulfill({ status: 503, body: 'unavailable' });
  });
  const user = {
    login: 'audit-edge',
    id: 2,
    name: 'Audit Edge',
    bio: 'Original biography.',
    public_repos: 1,
    followers: 0,
    created_at: '2020-01-01',
  };
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      status: route.request().url().includes('/repos?') ? 503 : 200,
      json: user,
    })
  );
  let aiMode = 'quota';
  let release;
  await page.route(
    'https://generativelanguage.googleapis.com/**',
    async (route) => {
      if (aiMode === 'cancel')
        await new Promise((resolve) => (release = resolve));
      try {
        await route.fulfill(
          aiMode === 'quota'
            ? {
                status: 429,
                json: { error: { code: 429, message: 'RESOURCE_EXHAUSTED' } },
              }
            : {
                json: {
                  candidates: [
                    { content: { parts: [{ text: '{"aboutMe":42}' }] } },
                  ],
                },
              }
        );
      } catch {}
    }
  );
  await page.goto(baseURL);
  await page.keyboard.press('Tab');
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    'Skip to content'
  );
  await page.keyboard.press('Enter');
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    'main-content'
  );
  await page
    .getByRole('button', { name: 'Generate my profile' })
    .first()
    .click();
  await page
    .getByRole('heading', { name: 'Start with your GitHub.' })
    .waitFor();
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    'step-heading-1'
  );
  await page.getByLabel('GitHub username').fill('audit-edge');
  await page
    .getByRole('button', { name: 'Import profile', exact: true })
    .click();
  await page
    .getByText('Profile loaded, but repository data is incomplete.', {
      exact: false,
    })
    .waitFor();
  await page.getByLabel('Header banner', { exact: true }).check();
  await page.getByText('Audit Edge profile banner could not load.').waitFor();
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await page.getByText('Audit Edge profile banner could not load.').waitFor();
  assert.ok(imageRequests >= 2);
  await page
    .getByRole('button', { name: 'Remove from README', exact: true })
    .click();
  assert.equal(
    await page.getByLabel('Header banner', { exact: true }).isChecked(),
    false
  );
  await page.getByLabel('Header banner', { exact: true }).check();
  await page.getByText('Audit Edge profile banner could not load.').waitFor();
  await page
    .getByRole('button', { name: 'Check widgets', exact: true })
    .click();
  await page
    .getByText('1 widget image(s) could not be loaded.', { exact: false })
    .waitFor();
  for (const checkbox of await page
    .getByRole('group', { name: 'Sections', exact: true })
    .getByRole('checkbox')
    .all())
    await checkbox.uncheck();
  assert.equal(
    await page.getByRole('button', { name: 'Copy', exact: true }).isDisabled(),
    true
  );
  await page
    .getByRole('heading', { name: 'Choose what to include.' })
    .waitFor();
  await page
    .getByRole('button', { name: 'Balanced A clear, complete story' })
    .click();
  await page.getByRole('button', { name: 'Review content' }).click();
  await page.getByText('Enhance with AI', { exact: false }).first().click();
  await page
    .getByLabel('Gemini API key', { exact: true })
    .fill('fake-only-intercepted');
  await page.getByLabel(/Send my name/).check();
  await page.getByRole('button', { name: 'Generate AI draft' }).click();
  await page.getByRole('alert').filter({ hasText: 'quota' }).waitFor();
  assert.equal(
    await page
      .getByRole('textbox', { name: 'About me', exact: true })
      .inputValue(),
    'Original biography.'
  );
  aiMode = 'malformed';
  await page.getByRole('button', { name: 'Generate AI draft' }).click();
  await page.getByRole('alert').filter({ hasText: 'invalid' }).waitFor();
  aiMode = 'cancel';
  await page.getByRole('button', { name: 'Generate AI draft' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  release?.();
  assert.equal(
    await page
      .getByRole('textbox', { name: 'About me', exact: true })
      .inputValue(),
    'Original biography.'
  );
  await page.getByRole('button', { name: 'Review & export' }).click();
  await page.waitForFunction(
    () => document.activeElement.id === 'preview-heading'
  );
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page
    .getByRole('button', { name: 'Style', exact: true })
    .first()
    .click();
  await page.getByLabel('Header banner', { exact: true }).check();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false
  );
  const accessibility = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .analyze();
  assert.equal(
    accessibility.violations.length,
    0,
    JSON.stringify(accessibility.violations)
  );
  const storageContext = await browser.newContext();
  const storagePage = await storageContext.newPage();
  await storagePage.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable in test');
    };
  });
  await storagePage.goto(baseURL);
  await storagePage.getByRole('button', { name: 'Explore a demo' }).click();
  await storagePage.getByLabel('Save my draft on this device').check();
  await storagePage
    .getByText('This browser could not save your draft.', { exact: false })
    .waitFor();
  await writeFile(
    artifactPath('edges-results.json'),
    JSON.stringify(
      {
        passed: [
          'keyboard skip link',
          'step heading focus',
          'partial repository failure',
          'widget retry',
          'widget removal disables section',
          'widget re-enable',
          'all-off empty state',
          'explicit widget readiness check',
          'AI quota error',
          'AI malformed response',
          'AI cancellation',
          'export focus',
          '320px style layout',
          'blocked storage feedback',
        ],
        accessibilityViolations: 0,
      },
      null,
      2
    )
  );
  console.log(
    'PASS: 14 failure-path, keyboard and layout checks. No accessibility violations.'
  );
} finally {
  await browser.close();
}
