import path from 'path';

import { BrowserContext, Page } from '@playwright/test';

const MOCKS_PATH = path.resolve(__dirname, '../cypress/mocks');

export const mocksFromFile = async (ctx: { route: Page['route'] }, fileName: string) => {
  const mocks: Array<{
    url: string;
    method: string;
    response: { status: number; body: any };
  }> = (await import(path.resolve(MOCKS_PATH, fileName))).default;

  await Promise.all(
    mocks.map(async (mock) => {
      const { url, response } = mock;
      await ctx.route(
        url,
        async (route) =>
          await route.fulfill({
            status: response.status,
            json: response.body,
          })
      );
    })
  );
};

export const setupCommonTest = async ({ page, context, baseURL }) => {
  await page.route('**/faq.e49945eb.svg', (route) => {
    route.fulfill({ path: 'cypress/fixtures/faq.e49945eb.svg' });
  });
  await page.route('**/ehoks.fdeaa517.svg', (route) =>
    route.fulfill({ path: 'cypress/fixtures/ehoks.fdeaa517.svg' })
  );

  await page.route('**/sv/translation.json', (route) => route.fulfill({ json: {} }));
  await page.route('https://occhat.elisa.fi/**', (route) => route.fulfill({ json: {} }));

  await mocksFromFile(page, 'common.mocks.json');

  await context.addCookies([
    { name: 'oph-mandatory-cookies-accepted', value: 'true', url: baseURL },
  ]);
};

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find((c) => c.name === name)?.value;
};

export const getSearchInput = (page: Page) =>
  page.getByPlaceholder('Etsi koulutuksia tai oppilaitoksia');

export const getSearchButton = (page: Page) => page.getByRole('button', { name: /Etsi/ });
