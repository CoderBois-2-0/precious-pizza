import { test, expect } from '@playwright/test';

const url = 'localhost:3000/login';

test('Can sign up new user', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const emailField = await page.getByLabel('user email');
  const passwordField = await page.getByLabel('user password');
});

test('Can navigate to login page', async ({ page }) => {
  await page.goto(url);

  await page.getByRole('link', { name: 'Already have an account?' }).click();

  await expect(
    page.getByRole('heading', { level: 5, name: 'Login' }),
  ).toBeVisible();
});
