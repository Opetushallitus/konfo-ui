import { expect, Page, test } from '@playwright/test';

import commonMocks from './mocks/common.mocks.json' with { type: 'json' };
import { getFixtureData, setupCommonTest } from './test-tools';

const CONTENT_URL = 'https://konfo-content.untuvaopintopolku.fi';
const TUTU_OPAS_PATH = '1763640000000/fi/tutkintojenTunnustamisenPalveluopas.json';

const mockTutuOpasContentful = async (page: Page) => {
  const manifest = commonMocks.find((mock) => mock.url === `${CONTENT_URL}/manifest.json`)
    ?.response.body;

  await page.route(`${CONTENT_URL}/manifest.json`, (route) =>
    route.fulfill({
      json: {
        ...manifest,
        tutkintojenTunnustamisenPalveluopas: { fi: TUTU_OPAS_PATH },
      },
    })
  );

  const opasJson = await getFixtureData('tutu-opas.json');

  await page.route(`${CONTENT_URL}/${TUTU_OPAS_PATH}`, (route) =>
    route.fulfill({
      json: [
        {
          id: 'tutu-palveluopas-test',
          type: 'tutkintojenTunnustamisenPalveluopas',
          nimi: 'Tutkintojen tunnustamisen palveluopas',
          opasJson,
        },
      ],
    })
  );
};

test.describe('Tutkintojen tunnustamisen palveluopas', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mockTutuOpasContentful(page);
    await page.goto(
      '/konfo/fi/tutkintojen-tunnustaminen/tutkintojen-tunnustamisen-palveluopas'
    );
  });

  test('Should be able to start wizard, follow a path to information view and get to konfo', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Tutkintojen tunnustamisen palveluopas' })
    ).toBeVisible();
    const startButton = page.getByRole('button', { name: 'Aloita' });
    await startButton.click();
    await expect(
      page.getByRole('heading', { name: 'Mitä haluat tehdä Suomessa?' })
    ).toBeVisible();
    const studyButton = page.getByRole('button', { name: 'Haluan opiskella' });
    await studyButton.click();
    await expect(
      page.getByRole('heading', { name: 'Mitä haluat opiskella?' })
    ).toBeVisible();
    const degreeButton = page.getByRole('button', { name: /Haluan suorittaa tutkinnon/ });
    await degreeButton.click();
    await expect(
      page.getByRole('heading', { name: /Hae opiskelupaikkaa/ })
    ).toBeVisible();
    const opintopolkuLink = page.getByText('Siirry Opintopolku-palveluun');
    await opintopolkuLink.click();
    await expect(page).toHaveURL(new RegExp('/konfo/fi'));
  });

  test('Should be able get back to start page with Aloita alusta button', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Tutkintojen tunnustamisen palveluopas' })
    ).toBeVisible();
    const startButton = page.getByRole('button', { name: 'Aloita' });
    await startButton.click();
    await expect(
      page.getByRole('heading', { name: 'Mitä haluat tehdä Suomessa?' })
    ).toBeVisible();
    const workButton = page.getByRole('button', { name: 'Haluan työskennellä' });
    await workButton.click();
    await expect(
      page.getByRole('heading', { name: 'Millaisissa tehtävissä haluat työskennellä?' })
    ).toBeVisible();
    const backToStartButton = page.getByRole('button', { name: 'Aloita alusta' });
    await backToStartButton.click();
    await expect(
      page.getByRole('heading', { name: 'Tutkintojen tunnustamisen palveluopas' })
    ).toBeVisible();
  });
});
