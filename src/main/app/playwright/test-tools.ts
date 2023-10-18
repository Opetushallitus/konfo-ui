import path from 'path';

import { BrowserContext, Locator, Page, Route, expect } from '@playwright/test';

const MOCKS_PATH = path.resolve(__dirname, './mocks');

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
  await context.addCookies([
    {
      name: 'oph-mandatory-cookies-accepted',
      value: 'true',
      url: new URL(baseURL).origin,
    },
  ]);
  await page.route('**/faq.e49945eb.svg', fixtureFromFile('faq.e49945eb.svg'));
  await page.route('**/ehoks.fdeaa517.svg', fixtureFromFile('ehoks.fdeaa517.svg'));

  await page.route('**/sv/translation.json', (route) => route.fulfill({ json: {} }));
  await page.route('https://occhat.elisa.fi/**', (route) => route.fulfill({ json: {} }));

  await mocksFromFile(page, 'common.mocks.json');
};

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find((c) => c.name === name)?.value;
};

export const getSearchInput = (page: Page) =>
  page.getByPlaceholder('Etsi koulutuksia tai oppilaitoksia');

export const getSearchButton = (page: Page) => page.getByRole('button', { name: /Etsi/ });

export const expectURLEndsWith = (page: Page, urlEnd: string) =>
  expect(page).toHaveURL(new RegExp(urlEnd + '$'));

const FIXTURES_PATH = path.resolve(__dirname, './fixtures');

export const getFixturePath = (fileName: string) => path.resolve(FIXTURES_PATH, fileName);

export const fixtureFromFile = (fileName: string) => (route: Route) =>
  route.fulfill({ path: getFixturePath(fileName) });

export const getFixtureData = async (fileName: string) =>
  (await import(getFixturePath(fileName)))?.default;

export const getSectionByHeading = async (
  loc: Locator | Page,
  headingText: string | RegExp,
  exact: boolean = false
) => {
  const label = loc.getByRole('heading', { name: headingText, exact });
  await label.evaluate((x) => x); // NOTE: Jostain syystä ilman tätä riviä ei toimi oikein. Mahdollisesti Playwrightin bugi?
  const id = await label.getAttribute('id');
  return loc.locator(`[aria-labelledby="${id}"]`);
};

// For debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const outerHTML = (l: Locator) => l.evaluate((el) => el.outerHTML);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const innerHTML = (l: Locator) => l.evaluate((el) => el.innerHTML);
