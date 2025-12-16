import { test } from '@dword-design/playwright-fixture-web-extension';
import { expect } from '@playwright/test';
import { execaCommand } from 'execa';

test.beforeAll(() => execaCommand('base prepublishOnly', { stdio: 'inherit' }));

test('works', async ({ page }) => {
  await page.goto(
    'https://github.com/github-repository-list-badges?tab=repositories',
  );

  const repositoriesList = page.locator('#user-repositories-list');
  await expect(repositoriesList).toBeAttached();
  const repositoryItems = repositoriesList.locator('li');
  const count = await repositoryItems.count();

  for (let i = 0; i < count; i++) {
    const item = repositoryItems.nth(i);
    await expect(item.locator('h3 .Label')).toBeVisible();
    await expect(item.locator('relative-time')).toBeVisible();
  }

  await repositoriesList.locator('relative-time').evaluateAll(els => {
    for (const el of els) {
      el.textContent = 'today';
    }
  });

  await expect(repositoriesList).toHaveScreenshot({
    mask: [repositoriesList.locator('li relative-time')],
  });
});
