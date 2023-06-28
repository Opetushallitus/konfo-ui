import { expect, test } from '@playwright/test';

import { getCookie } from './test-tools';

test.describe('Cookiemodal page', () => {
  test('Cookie modal can be accepted, and saves a cookie', async ({ page, context }) => {
    await context.clearCookies();
    await expect(await getCookie(context, 'oph-mandatory-cookies-accepted')).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Hyväksy' }).click();
    await expect(await getCookie(context, 'oph-mandatory-cookies-accepted')).toEqual(
      'true'
    );
  });
});
