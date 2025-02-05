import { expect, test } from '@playwright/test';

import { getCookie } from './test-tools';

test.describe('Cookiedrawer page', () => {
  test('Cookie modal can be accepted, and saves a cookie', async ({ page, context }) => {
    await context.clearCookies();
    await expect(await getCookie(context, 'oph-mandatory-cookies-accepted')).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Salli vain pakolliset evästeet' }).click();
    await expect(await getCookie(context, 'oph-mandatory-cookies-accepted')).toEqual(
      'true'
    );
  });

  test('Zustand store should persist in sessionStorage across reloads', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/');

    // Accept mandatory and statistics cookies
    await page.evaluate(() => {
      window.sessionStorage.setItem(
        'cookies-info-storage',
        JSON.stringify({
          state: {
            isMandatoryCookiesAccepted: true,
            isStatisticsCookiesAccepted: true,
            isCookieModalShown: false,
          },
          version: 0,
        })
      );
    });

    await page.reload();

    // Retrieve stored Zustand state from sessionStorage
    const storedState = await page.evaluate(() => {
      return JSON.parse(window.sessionStorage.getItem('cookies-info-storage') || '{}');
    });

    expect(storedState.state).toBeDefined();
    expect(storedState.state.isMandatoryCookiesAccepted).toBeTruthy();
    expect(storedState.state.isStatisticsCookiesAccepted).toBeTruthy();
    expect(storedState.state.isCookieModalShown).toBeFalsy();
  });
});
