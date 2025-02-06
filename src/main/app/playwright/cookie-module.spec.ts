import { expect, test } from '@playwright/test';

import { COOKIES } from '#/src/constants';

import { getCookie } from './test-tools';

test.describe('Cookie consent button clicking and cockie saving into browser memmory', () => {
  test('"Evästeasetukset"-button should open modal-window from drawer and "Salli vain pakolliset evästeet"-button should store mandatory cookies', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Evästeasetukset' }).click();
    await page.getByRole('button', { name: 'Salli vain pakolliset evästeet' }).click();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeTruthy();
  });

  test('Mandatory cookies can be accepted and stored from drawer-component', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeFalsy();
    await expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Salli kaikki evästeet' }).click();
    await expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeTruthy();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeTruthy();
  });

  test('Statistics & Mandatory cookies are accepted and stored from drawer-component', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeFalsy();
    await expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Salli vain pakolliset evästeet' }).click();
    await expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeTruthy();
  });

  test('"Tallenna asetukset"-button should store cookie consent selection correctly', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeFalsy();
    await expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Evästeasetukset' }).click();
    await page.getByRole('button', { name: 'Asetukset' }).click();
    await page.locator('#statisticCookies').click();
    await page.getByRole('button', { name: 'Tallenna asetukset' }).click();
    expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeTruthy();
    expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeTruthy();
    await expect(page.locator('h4', { hasText: 'Evästeet' })).toBeHidden();
  });
});
