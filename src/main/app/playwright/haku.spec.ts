import { test, expect } from '@playwright/test';

import {
  getSearchButton,
  getSearchInput,
  mocksFromFile,
  setupCommonTest,
} from './test-tools';

test.describe('Etusivu', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    setupCommonTest({ page, context, baseURL });

    await page.route('/konfo-backend/search/oppilaitokset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-oppilaitokset-all.json' });
    });

    await mocksFromFile(page, 'haku.mocks.json');

    await page.goto('/konfo/fi/haku');
  });

  test('Should show autocomplete suggestions', async ({ page }) => {
    test.slow();
    await page.route('/konfo-backend/search/autocomplete**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-autocomplete-auto.json' });
    });

    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const searchInput = getSearchInput(page);
    const koulutuksetNav = page.getByRole('navigation', { name: 'Koulutukset' });
    const oppilaitoksetNav = page.getByRole('navigation', { name: 'Oppilaitokset' });

    await expect(searchInput).toBeVisible();
    await searchInput.fill('auto');
    await koulutuksetNav.getByText('koulutus nimi fi').click();
    await page.waitForURL(new RegExp('/konfo/fi/koulutus/123456$'));
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await searchInput.click();
    await expect(
      koulutuksetNav.getByText('Näytä 1 hakuehdoilla löytyvä koulutus')
    ).toBeVisible();
    await koulutuksetNav.getByText('Näytä 1 hakuehdoilla löytyvä koulutus').click();
    await page.waitForURL(
      new RegExp('/konfo/fi/haku/auto\\?order=desc&size=20&sort=score')
    );
    await expect(page.getByRole('progressbar').last()).not.toBeVisible();
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('oppilaitos nimi fi').click();
    await page.waitForURL(new RegExp('konfo/fi/oppilaitos/654321$'));
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('Näytä 1 hakuehdoilla löytyvä oppilaitos').click();
    await page.waitForURL(
      new RegExp('/konfo/fi/haku/auto\\?order=desc&size=20&sort=score&tab=oppilaitos$')
    );
  });

  test("Koulutustyyppi switching between 'Tutkintoon johtavat' and 'Muut'", async ({
    page,
  }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const koulutustyyppiFilter = page.getByTestId('koulutustyyppi-filter');
    const tutkintoonJohtavatBtn = koulutustyyppiFilter.getByRole('button', {
      name: /Tutkintoon johtavat/i,
    });
    const muutBtn = koulutustyyppiFilter.getByRole('button', { name: /Muut/i });
    const ammatillinenKoulutusChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Ammatillinen koulutus/,
    });
    const ammatillinenPerustutkintoChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'Ammatillinen perustutkinto',
      exact: true,
    });
    const erikoisammattitutkintoChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Erikoisammattitutkinto/i,
    });
    const tutkinnonOsaChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Tutkinnon osa/i,
    });
    const osaamisalaChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Osaamisala/i,
    });
    const ammMuuChk = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Muu ammatillinen koulutus/i,
    });
    const telmaChk = koulutustyyppiFilter.getByRole('checkbox', { name: /TELMA/ });

    await expect(ammatillinenKoulutusChk).toBeVisible();
    await expect(ammatillinenPerustutkintoChk).toBeVisible();
    await expect(erikoisammattitutkintoChk).toBeVisible();
    await expect(tutkintoonJohtavatBtn).toHaveAttribute('aria-selected', 'true');
    await expect(muutBtn).toHaveAttribute('aria-selected', 'false');
    await muutBtn.click();
    await expect(muutBtn).toHaveAttribute('aria-selected', 'true');
    await expect(tutkintoonJohtavatBtn).toHaveAttribute('aria-selected', 'false');
    await expect(tutkinnonOsaChk).toBeVisible();
    await expect(osaamisalaChk).toBeVisible();
    await expect(ammMuuChk).toBeVisible();
    await expect(telmaChk).toBeVisible();
    await expect(ammatillinenPerustutkintoChk).not.toBeVisible();
    await expect(erikoisammattitutkintoChk).not.toBeVisible();
  });

  test('Koulutustyyppi checkboxes should work hierarchically', async ({ page }) => {
    test.slow();
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-all.json' });
    });

    const koulutustyyppiFilter = page.getByTestId('koulutustyyppi-filter');
    const amkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'AMK (korkeakoulutus)',
      exact: true,
    });
    const ylempiAmkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'Ylempi AMK',
      exact: true,
    });

    const alempiAmkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'AMK - tutkinto',
      exact: true,
    });

    await amkCheckbox.check();
    await expect(ylempiAmkCheckbox).toBeChecked();
    await expect(alempiAmkCheckbox).toBeChecked();

    await amkCheckbox.uncheck();
    await expect(ylempiAmkCheckbox).not.toBeChecked();
    await expect(alempiAmkCheckbox).not.toBeChecked();

    await alempiAmkCheckbox.check();
    await expect(amkCheckbox).toHaveAttribute('data-indeterminate', 'true');

    await ylempiAmkCheckbox.check();
    await expect(amkCheckbox).toBeChecked();
  });

  test('Opetustapa filter checkboxes and mobile summary view', async ({ page }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const opetustapaFilter = page.getByTestId('opetustapa-filter');
    const etaopetusChk = opetustapaFilter.getByRole('checkbox', { name: /Etäopetus/i });
    const verkkoOpiskeluChk = opetustapaFilter.getByRole('checkbox', {
      name: /Verkko-opiskelu/i,
    });

    await page.getByRole('button', { name: 'Opetustapa' }).click();

    await etaopetusChk.click();
    await expect(etaopetusChk).toBeChecked();
    await etaopetusChk.click();
    await expect(etaopetusChk).not.toBeChecked();
    await verkkoOpiskeluChk.click();
    await expect(verkkoOpiskeluChk).toBeChecked();
    await page.getByTestId('chip-opetuspaikkakk_3').locator('svg').click();
    await expect(page.getByTestId('opetustapa-filter')).toBeVisible();

    await expect(verkkoOpiskeluChk).not.toBeChecked();
  });

  test('Valintatapa filter checkboxes', async ({ page }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const valintatapaFilter = page.getByTestId('valintatapa-filter');
    const koepisteetChk = valintatapaFilter.getByRole('checkbox', {
      name: /Koepisteet/i,
    });
    const yhteispisteetChk = valintatapaFilter.getByRole('checkbox', {
      name: /Yhteispisteet/i,
    });

    await expect(page.getByRole('button', { name: 'Valintatapa' })).toBeVisible();
    await koepisteetChk.click();
    await expect(koepisteetChk).toBeChecked();
    await koepisteetChk.click();
    await expect(koepisteetChk).not.toBeChecked();
    await yhteispisteetChk.click();
    await expect(yhteispisteetChk).toBeChecked();
    await page.getByTestId('chip-valintatapajono_yp').locator('svg').click();

    await expect(yhteispisteetChk).not.toBeChecked();
  });

  test('Haku käynnissä filter checkbox', async ({ page }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const hakukaynnissaFilter = page.getByTestId('hakukaynnissa-filter');
    const hakuKaynnissaChk = hakukaynnissaFilter.getByRole('checkbox', {
      name: /Haku käynnissä/i,
    });

    await hakuKaynnissaChk.click();
    await expect(hakuKaynnissaChk).toBeChecked();
    await hakuKaynnissaChk.click();
    await expect(hakuKaynnissaChk).not.toBeChecked();
  });

  test('Hakutapa filter checkboxes', async ({ page }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const hakutapaFilter = page.getByTestId('hakutapa-filter');
    const yhteishakuChk = hakutapaFilter.getByRole('checkbox', { name: /Yhteishaku/i });
    const jatkuvaHakuChk = hakutapaFilter.getByRole('checkbox', {
      name: /Jatkuva haku/i,
    });
    await expect(page.getByText('Hakutapa')).toBeVisible();
    await jatkuvaHakuChk.click();
    await expect(jatkuvaHakuChk).toBeChecked();
    await jatkuvaHakuChk.click();
    await expect(jatkuvaHakuChk).not.toBeChecked();
    await yhteishakuChk.click();
    await page.getByTestId('chip-hakutapa_01').locator('svg').click();
    await expect(yhteishakuChk).not.toBeChecked();
  });

  test('Pohjakoulutusvaatimus filter checkboxes', async ({ page }) => {
    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-auto.json' });
    });

    const pohjakoulutusVaatimusFilter = page.getByTestId('pohjakoulutusvaatimus-filter');
    const ammatillinenPerustutkintoChk = pohjakoulutusVaatimusFilter.getByRole(
      'checkbox',
      {
        name: /Ammatillinen perustutkinto/i,
      }
    );
    const lukioChk = pohjakoulutusVaatimusFilter.getByRole('checkbox', {
      name: /Lukio/i,
    });
    await expect(page.getByText('Koulutustausta')).toBeVisible();

    await ammatillinenPerustutkintoChk.click();
    await expect(ammatillinenPerustutkintoChk).toBeChecked();
    await ammatillinenPerustutkintoChk.click();
    await expect(ammatillinenPerustutkintoChk).not.toBeChecked();
    await lukioChk.click();
    await page.getByTestId('chip-pohjakoulutusvaatimuskonfo_002').locator('svg').click();
    await expect(lukioChk).not.toBeChecked();
  });

  test('"Tutkinnon osa" koulutuskortti data presented correctly', async ({ page }) => {
    const searchInput = getSearchInput(page);
    const searchButton = getSearchButton(page);
    const tutkinnonOsaCard = page.getByTestId('Hevosten hyvinvoinnista huolehtiminen');

    await searchInput.fill('Hevosten hyvinvoinnista huolehtiminen');
    await searchButton.click();
    await expect(
      tutkinnonOsaCard.getByText('Tutkinnon osa', { exact: true })
    ).toBeVisible();
    await expect(
      tutkinnonOsaCard.getByText('25 + 50 osaamispistettä', { exact: true })
    ).toBeVisible();
  });

  test('"Osaamisala" koulutuskortti data presented correctly', async ({ page }) => {
    const searchInput = getSearchInput(page);
    const searchButton = getSearchButton(page);
    const osaamisalaCard = page.getByTestId('Jalkojenhoidon osaamisala');

    await searchInput.fill('Jalkojenhoidon osaamisala');
    await searchButton.click();
    await expect(osaamisalaCard.getByText('Osaamisala', { exact: true })).toBeVisible();
    await expect(
      osaamisalaCard.getByText('145 osaamispistettä', { exact: true })
    ).toBeVisible();
  });
});
