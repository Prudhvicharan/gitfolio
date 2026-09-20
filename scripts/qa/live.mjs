import { chromium, artifactPath, baseURL } from './runtime.mjs';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(baseURL);
  await page
    .getByRole('button', { name: 'Generate my profile' })
    .first()
    .click();
  await page.getByLabel('GitHub username').fill('Prudhvicharan');
  await page
    .getByRole('button', { name: 'Import profile', exact: true })
    .click();
  await Promise.race([
    page.getByRole('heading', { name: 'Your work. Your style.' }).waitFor(),
    page.getByRole('alert').waitFor(),
  ]);
  const result = {
    success: await page
      .getByRole('heading', { name: 'Your work. Your style.' })
      .isVisible(),
    notice: await page
      .locator('[role="alert"],.draft-settings [role="status"]')
      .allTextContents(),
    repoCount: await page.locator('.repo-option').count(),
  };
  await writeFile(
    artifactPath('live-results.json'),
    JSON.stringify(result, null, 2)
  );
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
