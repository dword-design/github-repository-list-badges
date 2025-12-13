import { test } from '@dword-design/playwright-fixture-web-extension';
import { expect } from '@playwright/test';
import execa from 'execa';

test.beforeAll(() =>
  execa.command('base prepublishOnly', { stdio: 'inherit' }),
);

test('works', async ({ page }) => {
  await page.goto(
    'https://github.com/github-repository-list-badges?tab=repositories',
  );

  const repositoriesList = page.locator('#user-repositories-list');
  await expect(repositoriesList).toBeAttached();

  await repositoriesList.locator('relative-time').evaluateAll(els => {
    for (const el of els) {
      el.textContent = 'today';
    }
  });

  await expect(repositoriesList).toHaveScreenshot();
});
