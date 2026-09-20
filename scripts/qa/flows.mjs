import { chromium, artifactPath, baseURL, AxeBuilder } from './runtime.mjs';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ['clipboard-read', 'clipboard-write'],
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const user = {
  login: 'audit-user',
  id: 123,
  name: 'Audit Developer',
  bio: 'I make useful tools.',
  company: null,
  blog: null,
  location: 'Chicago',
  email: null,
  public_repos: 2,
  followers: 3,
  following: 1,
  created_at: '2020-01-01',
  twitter_username: null,
  avatar_url: '',
};
const repos = [
  {
    id: 1,
    name: 'first-project',
    description: 'A useful tool.',
    language: 'TypeScript',
    topics: ['typescript'],
    stargazers_count: 5,
    forks_count: 0,
    fork: false,
    html_url: 'https://github.com/audit-user/first-project',
  },
  {
    id: 2,
    name: 'second-project',
    description: 'Another tool.',
    language: 'Python',
    topics: ['python'],
    stargazers_count: 2,
    forks_count: 0,
    fork: true,
    html_url: 'https://github.com/audit-user/second-project',
  },
];
await page.route('https://api.github.com/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/missing'))
    return route.fulfill({ status: 404, body: '{}' });
  return route.fulfill({
    json: url.includes('/repos?')
      ? repos
      : {
          ...user,
          login: url.endsWith('/other-user') ? 'other-user' : user.login,
        },
  });
});
await page.route('https://generativelanguage.googleapis.com/**', (route) =>
  route.fulfill({
    json: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  tagline: 'Useful tools',
                  aboutMe: 'I build first-project with TypeScript.',
                  skills: ['TypeScript'],
                  quote: '',
                  dreamProject: '',
                  currentlyLearning: '',
                  funFacts: [],
                  typingLines: ['TypeScript tools'],
                }),
              },
            ],
            role: 'model',
          },
          finishReason: 'STOP',
        },
      ],
    },
  })
);
await page.goto(baseURL);
await page.evaluate(() =>
  localStorage.setItem('gitfolio_gemini_key', 'fake-legacy-key-for-test')
);
await page.getByRole('button', { name: 'Generate my profile' }).first().click();
await page.getByLabel('GitHub username').fill('missing');
await page.getByRole('button', { name: 'Import profile', exact: true }).click();
await page.getByRole('alert').filter({ hasText: 'not found' }).waitFor();
await page.getByLabel('GitHub username').fill(' @audit-user ');
await page.getByRole('button', { name: 'Import profile', exact: true }).click();
await page.getByRole('heading', { name: 'Your work. Your style.' }).waitFor();
assert.equal(
  await page.evaluate(() => localStorage.getItem('gitfolio_gemini_key')),
  null
);
await page.getByLabel(/second-project/).check();
await page.getByRole('button', { name: 'Review content' }).click();
await page
  .getByRole('textbox', { name: 'About me', exact: true })
  .fill('My reviewed biography.');
assert.equal(
  await page.getByRole('button', { name: 'Copy', exact: true }).isDisabled(),
  true
);
await page.getByLabel(/I’ve reviewed this draft/).check();
await page.getByRole('button', { name: 'Apply reviewed content' }).click();
await page.getByRole('button', { name: 'Markdown', exact: true }).click();
assert.match(
  await page.getByLabel('Generated Markdown').inputValue(),
  /My reviewed biography/
);
await page.getByRole('button', { name: 'Copy', exact: true }).click();
assert.match(
  await page.evaluate(() => navigator.clipboard.readText()),
  /My reviewed biography/
);
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download', exact: true }).click();
const download = await downloadPromise;
assert.equal(download.suggestedFilename(), 'README.md');
assert.match(
  await readFile(await download.path(), 'utf8'),
  /My reviewed biography/
);
await page.getByText('Enhance with AI', { exact: false }).first().click();
await page
  .getByLabel('Gemini API key', { exact: true })
  .fill('fake-api-key-intercepted-by-local-test');
await page.getByLabel(/Send my name/).check();
await page.getByRole('button', { name: 'Generate AI draft' }).click();
await page.getByText('AI draft ready.', { exact: false }).waitFor();
assert.match(
  await page
    .getByRole('textbox', { name: 'About me', exact: true })
    .inputValue(),
  /first-project/
);
assert.match(
  await page.getByLabel('Generated Markdown').inputValue(),
  /My reviewed biography/
);
await page.getByLabel(/I’ve reviewed this draft/).check();
await page.getByRole('button', { name: 'Apply reviewed content' }).click();
await page.getByLabel('Save my draft on this device').check();
await page.getByRole('button', { name: 'Style', exact: true }).first().click();
await page.getByRole('button', { name: 'Review content' }).click();
assert.equal(
  await page.getByLabel('Gemini API key', { exact: true }).inputValue(),
  ''
);
assert.ok(
  !(
    await page.evaluate(() => localStorage.getItem('gitfolio_draft_v1'))
  ).includes('fake-api-key')
);
await page.reload();
await page.getByRole('button', { name: 'Generate my profile' }).first().click();
await page
  .getByRole('button', { name: 'Review', exact: false })
  .filter({ hasText: 'Review' })
  .first()
  .click();
await page.getByRole('heading', { name: 'Make every word yours.' }).waitFor();
assert.match(
  await page
    .getByRole('textbox', { name: 'About me', exact: true })
    .inputValue(),
  /first-project/
);
await page.getByRole('button', { name: 'Style', exact: true }).first().click();
await page.getByLabel('Contribution snake', { exact: true }).check();
const snakeDownload = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download snake.yml' }).click();
assert.match(
  await readFile(await (await snakeDownload).path(), 'utf8'),
  /github_user_name: audit-user/
);
await page
  .getByRole('button', { name: 'Profile', exact: true })
  .first()
  .click();
await page.getByLabel('GitHub username').fill('other-user');
page.once('dialog', (dialog) => dialog.accept());
await page.getByRole('button', { name: 'Import profile', exact: true }).click();
await page.getByRole('heading', { name: 'Your work. Your style.' }).waitFor();
await page.getByRole('button', { name: 'Markdown', exact: true }).click();
assert.doesNotMatch(
  await page.getByLabel('Generated Markdown').inputValue(),
  /I build first-project/
);
page.once('dialog', (dialog) => dialog.accept());
await page.getByRole('button', { name: 'Reset all' }).click();
await page.getByRole('heading', { name: 'Start with your GitHub.' }).waitFor();
assert.equal(await page.getByLabel('GitHub username').inputValue(), '');
assert.equal(
  await page.evaluate(() => localStorage.getItem('gitfolio_draft_v1')),
  null
);
const a11y = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
  .analyze();
await writeFile(
  artifactPath('flows-results.json'),
  JSON.stringify(
    {
      passed: [
        '404 recovery',
        'username normalization',
        'legacy key cleanup',
        'repository selection',
        'manual review gate',
        'copy',
        'README download',
        'mock AI success',
        'AI apply gate',
        'key clearing on step change',
        'credential-free saved draft',
        'draft recovery',
        'snake workflow download',
        'profile change clears AI',
        'reset all',
      ],
      a11y: a11y.violations,
      errors,
    },
    null,
    2
  )
);
console.log(
  'PASS: 15 end-to-end flows. Accessibility violations:',
  a11y.violations.length,
  'Runtime errors:',
  errors
);
await browser.close();
