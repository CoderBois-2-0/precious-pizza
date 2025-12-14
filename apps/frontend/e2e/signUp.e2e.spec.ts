import { expect, test } from '@playwright/test';

test.describe('Sign up page (E2E with mocked backend)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock sign-up API
    await page.route('**/signup', async (route) => {
      if (route.request().method() === 'POST') {
        const body = await route.request().postDataJSON();

        // Assert payload
        expect(body).toMatchObject({
          'first-name': 'Test',
          'last-name': 'User',
          email: 'test@e2e.com',
          'phone-number': '12345678',
          password: 'password123',
          'confirm-password': 'password123',
        });

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'user-1' }),
        });
      }
    });

    await page.goto('http://localhost:3000/signUp');
  });

  test('user can submit the sign up form with valid information', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

    await page.locator('#first-name').fill('Test');
    await page.locator('#last-name').fill('User');
    await page.locator('#email').fill('test@e2e.com');
    await page.locator('#phone-number').fill('12345678');
    await page.locator('#password').fill('password123');
    await page.locator('#confirm-password').fill('password123');

    await page.getByRole('button', { name: 'Sign up' }).click();

    // Assert we are still on the sign-up page (no redirect exists yet)
    await expect(page).toHaveURL(/signUp/);

    // Form is still visible
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('user can navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'go to login' }).click();

    await expect(page).toHaveURL(/login/);
  });
});
