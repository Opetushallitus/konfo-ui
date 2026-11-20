import { expect, Page, test } from '@playwright/test';

import {
  expectPageAccessibilityOk,
  expectURLEndsWith,
  fixtureFromFile,
  getSearchButton,
  getSearchInput,
  setupCommonTest,
} from './test-tools';

const ETUSIVU_URL = '/konfo/fi/etusivu';

const getRajaaButton = (page: Page) =>
  page.getByRole('button', { name: /^Rajaa etsimääsi/ });

const getSection = (page: Page, name: string) =>
  page.getByRole('region', { name, exact: true });

test.describe('Opintopolun etusivu', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await page.route(
      '/konfo-backend/search/oppilaitokset**',
      fixtureFromFile('search-oppilaitokset-all.json')
    );
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );
  });

  test('Should render hero with title, text and desktop image', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Opintopolku');
    await expect(
      page.getByText('Kaikki Suomen koulutukset ja oppilaitokset yhdessä palvelussa.', {
        exact: false,
      })
    ).toBeVisible();
    // Selain valitsee kuvan <picture>-elementin <source>-ehdon perusteella (currentSrc)
    const heroImage = page.locator('.hero-image img');
    await expect
      .poll(() => heroImage.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/herokuva_opintopolku_etusivu_desktop\.svg$/);
    await expect(heroImage).toHaveAttribute('alt', '');
  });

  test('Should render section headings from contentful', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    for (const name of [
      'Hae koulutuksia ja oppilaitoksia',
      'Koulutustieto',
      'Kirjautuneen palvelut',
      'Muut palvelut',
    ]) {
      await expect(
        page.getByRole('heading', { level: 2, name, exact: true })
      ).toBeVisible();
    }
  });

  test('Should render koulutustieto nostot as internal links', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    const section = getSection(page, 'Koulutustieto');
    for (const name of [
      'Hakeutuminen koulutukseen',
      'Kielitutkinnot',
      'Tutkintojen tunnustaminen',
    ]) {
      await expect(section.getByRole('heading', { level: 3, name })).toBeVisible();
    }
    // Kolme yhden linkin nostoa ja kolmen linkin nosto (Yhteishaku)
    await expect(section.getByRole('link')).toHaveCount(6);

    await section.getByRole('link', { name: 'Hakeutuminen koulutukseen' }).click();
    await expect(page).toHaveURL(/\/konfo\/fi\/$/);
  });

  test('Should render koulutustieto nosto with multiple links as link buttons', async ({
    page,
  }) => {
    await page.goto(ETUSIVU_URL);
    const section = getSection(page, 'Koulutustieto');

    // Monen linkin nostossa otsikko ei ole linkki, vaan linkit ovat erillisiä painikkeita
    await expect(
      section.getByRole('heading', { level: 3, name: 'Yhteishaku' })
    ).toBeVisible();
    await expect(section.getByRole('link', { name: 'Yhteishaku' })).toHaveCount(0);

    // Sisäiset linkit lokalisoidaan nykyiselle kielelle
    await expect(section.getByRole('link', { name: 'Hae yhteishaussa' })).toHaveAttribute(
      'href',
      '/konfo/fi/haku'
    );
    await expect(
      section.getByRole('link', { name: 'Lisätietoa yhteishausta' })
    ).toHaveAttribute('href', 'https://www.oph.fi/fi/yhteishaku');
    await expect(section.getByRole('link', { name: 'Hakuohjeet' })).toHaveAttribute(
      'href',
      '/konfo/fi/sisaltohaku'
    );

    await section.getByRole('link', { name: 'Hae yhteishaussa' }).click();
    await expect(page).toHaveURL(/\/konfo\/fi\/haku(\?.*)?$/);
  });

  test('Should render kirjautuneen palvelut and muut palvelut nostot as links', async ({
    page,
  }) => {
    await page.goto(ETUSIVU_URL);

    const kirjautuneenPalvelut = getSection(page, 'Kirjautuneen palvelut');
    await expect(kirjautuneenPalvelut.getByRole('link')).toHaveCount(1);
    await expect(
      kirjautuneenPalvelut.getByRole('heading', { level: 3, name: 'Oma Opintopolku' })
    ).toBeVisible();
    await expect(
      kirjautuneenPalvelut.getByRole('link', { name: 'Oma Opintopolku' })
    ).toHaveAttribute('href', 'https://opintopolku.fi/oma-opintopolku');

    const muutPalvelut = getSection(page, 'Muut palvelut');
    await expect(muutPalvelut.getByRole('link')).toHaveCount(2);
    await expect(
      muutPalvelut.getByRole('link', { name: 'Opetushallitus' })
    ).toHaveAttribute('href', 'https://www.oph.fi/fi');
    await expect(
      muutPalvelut.getByRole('link', { name: 'Osaamispolku' })
    ).toHaveAttribute('href', 'https://osaamispolku.fi/');
  });

  test('Should hide contentful sections without nostot', async ({ page }) => {
    await page.route(
      'https://konfo-content.untuvaopintopolku.fi/*/fi/opintopolkuEtusivu.json',
      (route) =>
        route.fulfill({
          json: [
            {
              id: 'etusivu-1',
              name: 'Opintopolun etusivu',
              type: 'opintopolkuEtusivu',
              koulutustietoOtsikko: 'Koulutustieto',
              koulutustietoNostot: [],
              kirjautuneenPalvelutOtsikko: 'Kirjautuneen palvelut',
              kirjautuneenPalvelutNostot: [],
              muutPalvelutOtsikko: 'Muut palvelut',
              muutPalvelutNostot: [],
            },
          ],
        })
    );
    await page.goto(ETUSIVU_URL);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Opintopolku');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Hae koulutuksia ja oppilaitoksia' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(1);
  });

  test('Should search with keyword', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await getSearchInput(page).fill('auto');
    await getSearchButton(page).click();
    await expectURLEndsWith(page, '/konfo/fi/haku/auto?order=desc&size=20&sort=score');
    await expect(getSearchInput(page)).toHaveValue('auto');
  });

  test('Should disable search button with too short keyword', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await getSearchInput(page).fill('au');
    await expect(getSearchButton(page)).toBeDisabled();
    await expect(page.getByText('Syötä ainakin kolme merkkiä')).toBeVisible();
  });

  test('Should navigate to haku page with "Näytä kaikki" link', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await page
      .getByRole('link', { name: 'Näytä kaikki koulutukset ja oppilaitokset' })
      .click();
    await expect(page).toHaveURL(/\/konfo\/fi\/haku(\?.*)?$/);
  });

  test('Should pass koulutustyyppi filter selection from popover to haku page', async ({
    page,
  }) => {
    await page.goto(ETUSIVU_URL);
    await getSearchInput(page).fill('auto');
    const rajaaButton = getRajaaButton(page);
    await expect(rajaaButton).toHaveAttribute('aria-expanded', 'false');
    await rajaaButton.click();
    await page.getByTestId('valitse_koulutustyyppi').click();
    await page
      .getByRole('checkbox', { name: 'Lukiokoulutukset', exact: true })
      .filter({ visible: true })
      .check();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    // Valittujen rajainten määrä näkyy painikkeessa
    await expect(rajaaButton).toContainText('1');
    await getSearchButton(page).click();
    await expectURLEndsWith(
      page,
      '/konfo/fi/haku/auto?koulutustyyppi=lk&order=desc&size=20&sort=score'
    );
  });

  test('Should reset search keyword when returning to etusivu', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await getSearchInput(page).fill('auto');
    await getSearchButton(page).click();
    await expectURLEndsWith(page, '/konfo/fi/haku/auto?order=desc&size=20&sort=score');
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Opintopolku');
    await expect(getSearchInput(page)).toHaveValue('');
  });

  test('Should not render palvelut section of the default layout', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Opintopolku');
    await expect(page.getByRole('heading', { name: 'eHOKS', exact: true })).toBeHidden();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('Should pass accessibility checks', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Muut palvelut' })
    ).toBeVisible();
    await expect(getRajaaButton(page)).toBeVisible();
    await expectPageAccessibilityOk(page);
  });
});
