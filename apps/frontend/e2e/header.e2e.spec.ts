import { expect, test } from '@playwright/test';

test.describe('Header navigation (E2E)', () => {
  test('unauthenticated user sees login and signup links', async ({ page }) => {
    // Mock unauthenticated
    await page.route('**/auth/**', async (route) => {
      await route.fulfill({ status: 401 });
    });

    await page.goto('http://localhost:3000/');

    // Open sidebar
    await page.getByRole('button', { name: 'Open menu' }).click();

    // Two login links: header + sidebar
    await expect(page.getByRole('link', { name: 'Login' })).toHaveCount(2);

    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'User page' })).toHaveCount(0);

    await expect(page.getByRole('link', { name: 'Admin' })).toHaveCount(0);
  });

  test('authenticated user sees user page and sign out', async ({ page }) => {
    // Mock authenticated user
    await page.route('**/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          firstName: 'Test',
          role: 'user',
        }),
      });
    });

    await page.goto('http://localhost:3000/');

    // Wait for auth-dependent UI
    await page.getByRole('button', { name: 'Open menu' }).click();

    await expect(page.getByRole('link', { name: 'User page' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });

  test('admin user sees admin link', async ({ page }) => {
    // Mock admin user
    await page.route('**/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'admin-1',
          firstName: 'Admin',
          role: 'admin',
        }),
      });
    });

    await page.goto('http://localhost:3000/');

    await page.getByRole('button', { name: 'Open menu' }).click();

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  });
});
