import { expect, test } from '@playwright/test';

import { COOKIES } from '#/src/constants';

import { getCookie } from './test-tools';

test.describe('Cookie consent button clicking and cockie saving into browser memmory', () => {
  const clearAndChekNoCookies = async (context) => {
    await context.clearCookies();
    expect(await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME)).toBeFalsy();
  };

  const checkCookiesPresence = async (
    context,
    mandatory: boolean,
    statistics: boolean
  ) => {
    const mandatoryValue = await getCookie(context, COOKIES.MANDATORY_COOKIE_NAME);
    const statisticsValue = await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME);
    expect(Boolean(mandatoryValue)).toBe(mandatory);
    expect(Boolean(statisticsValue)).toBe(statistics);
  };
  test('"Evästeasetukset"-button should open modal-window from drawer and "Salli vain pakolliset evästeet"-button should store mandatory cookies', async ({
    page,
    context,
  }) => {
    await clearAndChekNoCookies(context);
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Evästeasetukset' }).click();
    await page.getByRole('button', { name: 'Salli vain pakolliset evästeet' }).click();
    await checkCookiesPresence(context, true, false);
  });

  test('"Salli kaikki evästeet" stores both mandatory and statistics cookies', async ({
    page,
    context,
  }) => {
    await clearAndChekNoCookies(context);
    expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Salli kaikki evästeet' }).click();
    await checkCookiesPresence(context, true, true);
  });

  test('"Salli vain pakolliset evästeet" stores only mandatory cookies', async ({
    page,
    context,
  }) => {
    await clearAndChekNoCookies(context);
    expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Salli vain pakolliset evästeet' }).click();
    await checkCookiesPresence(context, true, false);
  });

  test('"Tallenna asetukset"-button saves user cookie preferences correctly', async ({
    page,
    context,
  }) => {
    await clearAndChekNoCookies(context);
    expect(await getCookie(context, COOKIES.STATISTICS_COOKIE_NAME)).toBeFalsy();
    await page.goto('/konfo/fi/');
    await page.getByRole('button', { name: 'Evästeasetukset' }).click();
    await page.getByRole('button', { name: 'Asetukset' }).click();
    await page.locator('#statisticCookies').click();
    await page.getByRole('button', { name: 'Tallenna asetukset' }).click();
    await checkCookiesPresence(context, true, true);
    await expect(page.locator('h4', { hasText: 'Evästeet' })).toBeHidden();
  });
});
