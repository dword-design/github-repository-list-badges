import { test } from '@dword-design/playwright-fixture-web-extension';
import { expect } from '@playwright/test';
import { execaCommand } from 'execa';
import { range } from 'lodash-es';

test.beforeAll(() => execaCommand('base prepublishOnly', { stdio: 'inherit' }));

test('works', async ({ page }) => {
  await page.goto(
    'https://github.com/github-repository-list-badges?tab=repositories',
  );

  const repositoriesList = page.locator('#user-repositories-list');
  await expect(repositoriesList).toBeAttached();
  const repositoryItems = repositoriesList.locator('li');
  const count = await repositoryItems.count();

  await Promise.all(
    range(count).flatMap(index => {
      const item = repositoryItems.nth(index);
      return [
        expect(item.locator('h3 .Label')).toBeVisible(),
        expect(item.locator('relative-time')).toBeVisible(),
      ];
    }),
  );

  await expect(repositoriesList).toHaveScreenshot({
    mask: [repositoriesList.locator('li relative-time')],
  });
});
