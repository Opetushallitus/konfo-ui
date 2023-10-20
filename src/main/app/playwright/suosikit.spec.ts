import { Page, Route, expect, test } from '@playwright/test';

import {
  expectURLEndsWith,
  fixtureFromFile,
  getFixtureData,
  getByHeadingLabel,
  setupCommonTest,
} from './test-tools';

const SUOSIKKI_OIDS = [
  '1.2.246.562.20.00000000000000041481',
  '1.2.246.562.20.00000000000000041502',
];

const mockSuosikit = async (
  page: Page,
  resOids: Array<string> = SUOSIKKI_OIDS,
  reqOids = resOids
) => {
  await page.route(
    '/konfo-backend/suosikit?hakukohde-oids=' + reqOids.join(','),
    async (route: Route) => {
      const suosikitData = await getFixtureData('suosikit-data.json');
      return route.fulfill({
        json: suosikitData?.filter((item) => resOids.includes(item.hakukohdeOid)),
      });
    }
  );
};

const gotoWithInit = async (page: Page, url, init: () => Promise<void>) => {
  await page.goto(url, { waitUntil: 'commit' });
  await init();
  await page.waitForURL(url), { waitUntil: 'domcontentloaded' };
  await expect(page.getByRole('progressbar')).toBeHidden();
};

const initLocalstorage = async (page: Page, oids: Array<string>) => {
  await page.evaluate(
    (s) => {
      localStorage.setItem('favorites', JSON.stringify(s));
    },
    {
      state: {
        suosikitSelection: Object.fromEntries(
          oids.map((oid, index) => [
            oid,
            {
              timestamp: `2023-10-12T12:1${index}:19+03:00`,
            },
          ])
        ),
      },
      version: 0,
    }
  );
};

const getSuosikitBtn = (page: Page) => {
  return page.locator('header').getByRole('link', { name: 'Suosikit' });
};

test.describe('Suosikit', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mockSuosikit(page);
  });

  test('Should list added suosikit', async ({ page }) => {
    await gotoWithInit(page, '/konfo/fi/suosikit', () =>
      initLocalstorage(page, SUOSIKKI_OIDS)
    );
    await expect(page.getByRole('heading', { name: 'Suosikit' })).toBeVisible();
    await expect(page.getByText('2 tallennettua hakukohdetta')).toBeVisible();
    const suosikitListItems = page.getByTestId('suosikit-list').getByRole('listitem');
    const firstSuosikki = suosikitListItems.nth(0);
    const secondSuosikki = suosikitListItems.nth(1);
    await expect(
      firstSuosikki.getByRole('heading', {
        name: 'Ajoneuvotekniikan osaamisala, Ajoneuvoalan perustutkinto (vaativa erityinen tuki)',
      })
    ).toBeVisible();
    await expect(
      secondSuosikki.getByRole('heading', {
        name: 'Vauriokorjauksen osaamisala, Ajoneuvoalan perustutkinto (vaativa erityinen tuki)',
      })
    ).toBeVisible();
  });

  test('Should "soft-remove" suosikki when clicking the button on suosikit-page and permanently remove after reloading the page', async ({
    page,
  }) => {
    await gotoWithInit(page, '/konfo/fi/suosikit', () =>
      initLocalstorage(page, SUOSIKKI_OIDS)
    );
    const suosikitListItems = page.getByTestId('suosikit-list').getByRole('listitem');
    const firstSuosikki = suosikitListItems.nth(0);
    const secondSuosikki = suosikitListItems.nth(1);

    const suosikitBtn = getSuosikitBtn(page);
    const suosikitBadge = suosikitBtn.getByTestId('suosikit-badge');
    await expect(suosikitBadge).toHaveText('2');
    await firstSuosikki.getByRole('button', { name: 'Poista suosikeista' }).click();
    await expect(suosikitBadge).toHaveText('1');
    await expect(suosikitListItems).toHaveCount(2);
    await firstSuosikki.getByRole('button', { name: 'Kumoa poisto' }).click();
    await expect(suosikitBadge).toHaveText('2');
    await secondSuosikki.getByRole('button', { name: 'Poista suosikeista' }).click();
    await expect(suosikitBadge).toHaveText('1');
    await page.goto('/konfo/fi');
    await mockSuosikit(page, [SUOSIKKI_OIDS[0]]);
    await page.goto('/konfo/fi/suosikit');
    await expect(suosikitBadge).toHaveText('1');
    await expect(suosikitListItems).toHaveCount(1);
  });

  test('Should hide suosikit which have no data and show notification', async ({
    page,
  }) => {
    await mockSuosikit(page, [SUOSIKKI_OIDS[0]], SUOSIKKI_OIDS);
    await mockSuosikit(page, [SUOSIKKI_OIDS[0]]);

    await gotoWithInit(page, '/konfo/fi/suosikit', () =>
      initLocalstorage(page, SUOSIKKI_OIDS)
    );
    const suosikitListItems = page.getByTestId('suosikit-list').getByRole('listitem');
    await expect(suosikitListItems).toHaveCount(1);
    const onlySuosikki = suosikitListItems.nth(0);
    await expect(
      onlySuosikki.getByRole('heading', {
        name: 'Ajoneuvotekniikan osaamisala, Ajoneuvoalan perustutkinto (vaativa erityinen tuki)',
      })
    ).toBeVisible();
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();

    await alert.getByRole('button', { name: 'Poista piilotetut' }).click();
    await expect(alert).toBeHidden();
    await expect(suosikitListItems).toHaveCount(1);
  });

  test('Should add and remove suosikki when clicking add button on toteutus page', async ({
    page,
  }) => {
    await page.route(
      '/konfo-backend/koulutus/1.2.246.562.13.00000000000000000018',
      fixtureFromFile('koulutus-ajoneuvoalan-perustutkinto.json')
    );

    await page.route(
      '/konfo-backend/toteutus/1.2.246.562.17.00000000000000005375',
      fixtureFromFile('toteutus-ajoneuvoalan-perustutkinto.json')
    );

    await page.route(
      '/konfo-backend/kuvaus/7614470',
      fixtureFromFile('konfo-backend_kuvaus_7614470.json')
    );
    await gotoWithInit(
      page,
      '/konfo/fi/toteutus/1.2.246.562.17.00000000000000005375',
      () => initLocalstorage(page, SUOSIKKI_OIDS)
    );

    const hakukohteetSection = await getByHeadingLabel(
      page,
      'Koulutuksen hakukohteet',
      true
    );

    const yhteishautSection = await getByHeadingLabel(hakukohteetSection, 'Yhteishaku');

    const yhteishakukohteet = yhteishautSection.getByRole('listitem');

    const yhteishakukohdeItemsWithRemoveButton = yhteishakukohteet.filter({
      has: page.getByRole('button', { name: 'Poista suosikeista' }),
    });

    await expect(yhteishakukohdeItemsWithRemoveButton).toHaveCount(2);

    await expect(yhteishakukohdeItemsWithRemoveButton.nth(1)).toContainText(
      'Ajoneuvotekniikan osaamisala, Ajoneuvoalan perustutkinto (vaativa erityinen tuki)'
    );

    const suosikitBtn = getSuosikitBtn(page);
    const suosikitBadge = suosikitBtn.getByTestId('suosikit-badge');
    await expect(suosikitBadge).toHaveText('2');

    const firstYhteishakukohde = yhteishakukohteet.first();
    await firstYhteishakukohde
      .getByRole('button', { name: 'Poista suosikeista' })
      .click();

    await expect(suosikitBadge).toHaveText('1');
    await firstYhteishakukohde.getByRole('button', { name: 'Lisää suosikiksi' }).click();
    await expect(suosikitBadge).toHaveText('2');
    const alertKatsoSuosikkejaLink = page
      .getByRole('alert')
      .getByRole('link', { name: 'Katso suosikkejasi' });
    await expect(alertKatsoSuosikkejaLink).toBeVisible();
    await alertKatsoSuosikkejaLink.click();
    await expectURLEndsWith(page, '/konfo/fi/suosikit');
  });
});
