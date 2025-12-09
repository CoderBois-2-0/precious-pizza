// eslint-disable

import { expect, test } from '@playwright/test';

const url = 'localhost:3000';
const path = '/login';

test('Can login user', async ({ page }) => {
  await page.goto(`${url}/${path}`);

  const emailField = page.getByLabel('user email');
  await emailField.fill('sid.doro-hd@protonmail.com');

  const passwordField = page.getByLabel('user password');
  await passwordField.fill('adminadmin');

  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.click();

  expect(page.url()).toBe(url);
});

test('can navigate to sign up page', async ({ page }) => {
  await page.goto(url);

  const signUpLink = page.getByLabel('go to sign up');

  await expect(signUpLink).toBeVisible();
});
