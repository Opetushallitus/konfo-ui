import { test, expect } from '@playwright/test';

import {
  expectURLEndsWith,
  fixtureFromFile,
  getSearchButton,
  getSearchInput,
  mocksFromFile,
  setupCommonTest,
} from './test-tools';

test.describe('Haku', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });

    await page.route(
      '/konfo-backend/search/oppilaitokset**',
      fixtureFromFile('search-oppilaitokset-all.json')
    );

    await mocksFromFile(page, 'haku.mocks.json');
  });

  test('Should show autocomplete suggestions', async ({ page }) => {
    test.slow();
    await page.route(
      '/konfo-backend/search/autocomplete**',
      fixtureFromFile('search-autocomplete-auto.json')
    );

    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const searchInput = getSearchInput(page);
    const koulutuksetNav = page.getByRole('navigation', { name: 'Koulutukset' });
    const oppilaitoksetNav = page.getByRole('navigation', { name: 'Oppilaitokset' });

    await expect(searchInput).toBeVisible();
    await searchInput.fill('auto');
    await koulutuksetNav.getByText('koulutus nimi fi').click();
    await expect(page).toHaveURL(new RegExp('/konfo/fi/koulutus/123456$'));
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await searchInput.click();
    await expect(
      koulutuksetNav.getByText('Näytä 1 hakuehdoilla löytyvä koulutus')
    ).toBeVisible();
    await koulutuksetNav.getByText('Näytä 1 hakuehdoilla löytyvä koulutus').click();
    await expectURLEndsWith(
      page,
      '/konfo/fi/haku/auto?order=desc&size=20&sort=score&tab=koulutus'
    );
    await expect(page.getByRole('progressbar').last()).toBeHidden();
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('oppilaitos nimi fi').click();
    await expect(page).toHaveURL(new RegExp('/konfo/fi/oppilaitos/654321$'));
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('Näytä 1 hakuehdoilla löytyvä oppilaitos').click();
    await expectURLEndsWith(
      page,
      '/konfo/fi/haku/auto?order=desc&size=20&sort=score&tab=oppilaitos'
    );
  });

  test('Koulutustyyppi checkboxes should work hierarchically', async ({ page }) => {
    test.slow();
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );
    await page.goto('/konfo/fi/haku');

    const koulutustyyppiFilter = page.getByTestId('koulutustyyppi-filter');
    const amkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'Ammattikorkeakoulujen koulutukset',
      exact: true,
    });

    const ylempiAmkCheckbox = koulutustyyppiFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-amk-ylempi"]'
    );
    const ylempiAmkLabel = page.locator('#filter-list-label-amk-ylempi');

    const alempiAmkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'AMK-tutkinnot',
      exact: true,
    });

    await koulutustyyppiFilter.getByTestId('show-more-amk').click();
    await amkCheckbox.check();
    await expect(ylempiAmkLabel).toHaveText(/Ylemmät AMK-tutkinnot/);
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
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const opetustapaFilter = page.getByTestId('opetustapa-filter');
    const etaopetusChk = opetustapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-opetuspaikkakk_2"]'
    );
    const etaopetusLabel = page.locator('#filter-list-label-opetuspaikkakk_2');
    const verkkoOpiskeluChk = opetustapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-opetuspaikkakk_3"]'
    );
    const verkkoOpiskeluLabel = page.locator('#filter-list-label-opetuspaikkakk_3');

    await page.getByRole('button', { name: 'Opetustapa' }).click();
    await expect(etaopetusLabel).toHaveText(/Etäopetus/);
    await expect(verkkoOpiskeluLabel).toHaveText(/Verkko-opiskelu/);
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
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const valintatapaFilter = page.getByTestId('valintatapa-filter');
    const koepisteetChk = valintatapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-valintatapajono_kp"]'
    );
    const yhteispisteetChk = valintatapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-valintatapajono_yp"]'
    );
    const koepisteetLabel = page.locator('#filter-list-label-valintatapajono_kp');
    const yhteispisteetLabel = page.locator('#filter-list-label-valintatapajono_yp');

    const valintatapaButton = page.getByRole('button', { name: 'Valintatapa' });
    await expect(valintatapaButton).toBeVisible();
    await valintatapaButton.click();
    await expect(koepisteetLabel).toHaveText(/Koepisteet/);
    await expect(yhteispisteetLabel).toHaveText(/Yhteispisteet/);
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
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const hakukaynnissaFilter = page.getByTestId('hakukaynnissa-filter');
    const hakuKaynnissaChk = hakukaynnissaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-hakukaynnissa"]'
    );
    const hakuKaynnissaLabel = page.locator('#filter-list-label-hakukaynnissa');

    await hakuKaynnissaChk.click();
    await expect(hakuKaynnissaLabel).toHaveText(/Haku käynnissä/);
    await expect(hakuKaynnissaChk).toBeChecked();
    await hakuKaynnissaChk.click();
    await expect(hakuKaynnissaChk).not.toBeChecked();
  });

  test('Hakutapa filter checkboxes', async ({ page }) => {
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const hakutapaFilter = page.getByTestId('hakutapa-filter');
    const jatkuvaHakuChk = hakutapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-hakutapa_03"]'
    );
    const jatkuvaHakuLabel = page.locator('#filter-list-label-hakutapa_03');
    const yhteishakuChk = hakutapaFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-hakutapa_01"]'
    );
    const yhteisHakuLabel = page.locator('#filter-list-label-hakutapa_01');

    const hakutapaButton = page.getByRole('button', { name: 'Hakutapa' });
    await expect(hakutapaButton).toBeVisible();
    await hakutapaButton.click();
    await expect(jatkuvaHakuLabel).toHaveText(/Jatkuva haku/);
    await expect(yhteisHakuLabel).toHaveText(/Yhteishaku/);
    await jatkuvaHakuChk.click();
    await expect(jatkuvaHakuChk).toBeChecked();
    await jatkuvaHakuChk.click();
    await expect(jatkuvaHakuChk).not.toBeChecked();
    await yhteishakuChk.click();
    await page.getByTestId('chip-hakutapa_01').locator('svg').click();
    await expect(yhteishakuChk).not.toBeChecked();
  });

  test('Pohjakoulutusvaatimus filter checkboxes', async ({ page }) => {
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const pohjakoulutusVaatimusFilter = page.getByTestId('pohjakoulutusvaatimus-filter');
    const ammatillinenPerustutkintoChk = pohjakoulutusVaatimusFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-pohjakoulutusvaatimuskonfo_am"]'
    );
    const ammatillinenPerustutkintoLabel = page.locator(
      '#filter-list-label-pohjakoulutusvaatimuskonfo_am'
    );
    const lukioChk = pohjakoulutusVaatimusFilter.locator(
      'input[type="checkbox"][aria-labelledby="filter-list-label-pohjakoulutusvaatimuskonfo_002"]'
    );
    const lukioLabel = page.locator('#filter-list-label-pohjakoulutusvaatimuskonfo_002');
    const koulutustaustaButton = page.getByRole('button', { name: 'Koulutustausta' });
    await expect(koulutustaustaButton).toBeVisible();
    await koulutustaustaButton.click();
    await expect(ammatillinenPerustutkintoLabel).toHaveText(/Ammatillinen perustutkinto/);
    await expect(lukioLabel).toHaveText(/Lukio/);
    await ammatillinenPerustutkintoChk.click();
    await expect(ammatillinenPerustutkintoChk).toBeChecked();
    await ammatillinenPerustutkintoChk.click();
    await expect(ammatillinenPerustutkintoChk).not.toBeChecked();
    await lukioChk.click();
    await page.getByTestId('chip-pohjakoulutusvaatimuskonfo_002').locator('svg').click();
    await expect(lukioChk).not.toBeChecked();
  });

  test('"Tutkinnon osa" koulutuskortti data presented correctly', async ({ page }) => {
    await page.goto('/konfo/fi/haku');
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
    await page.goto('/konfo/fi/haku');
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

  test('Should reset pagination after navigating first to page 2 and then using search', async ({
    page,
  }) => {
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );
    await page.goto('/konfo/fi/haku');

    const currentButtonPage1 = page.locator('[aria-current="page"]');
    const page2Button = page.getByRole('button', { name: 'Siirry sivulle 2' });

    await expect(currentButtonPage1).toHaveAttribute(
      'aria-label',
      'Sivu 1, nykyinen sivu'
    );
    await expect(page2Button).not.toHaveAttribute('aria-current');

    // Pyynnössä täytyy olla parametrina page=2
    const requestPromiseForPage2Click = page.waitForRequest(
      (request) => {
        return (
          request.url() ===
            'http://localhost:3005/konfo-backend/search/koulutukset?lng=fi&order=desc&page=2&size=20&sort=score' &&
          request.method() === 'GET'
        );
      },
      { timeout: 5000 }
    );
    await page2Button.click();
    await requestPromiseForPage2Click;

    const currentButtonPage2 = page.locator('[aria-current="page"]');

    await expect(currentButtonPage2).toHaveAttribute(
      'aria-label',
      'Sivu 2, nykyinen sivu'
    );

    // Tehdään haku hakusanalla "auto"
    const searchInput = getSearchInput(page);
    await searchInput.fill('auto');

    const searchButton = getSearchButton(page);

    // Urlissa tällä kertaa page=1
    const requestPromiseForSearchWithSearchWord = page.waitForRequest(
      (request) => {
        return (
          request.url() ===
            'http://localhost:3005/konfo-backend/search/koulutukset?keyword=auto&lng=fi&order=desc&page=1&size=20&sort=score' &&
          request.method() === 'GET'
        );
      },
      { timeout: 5000 }
    );

    await searchButton.click();
    await requestPromiseForSearchWithSearchWord;

    await expect(currentButtonPage1).toHaveAttribute(
      'aria-label',
      'Sivu 1, nykyinen sivu'
    );
    await expect(page2Button).not.toHaveAttribute('aria-current');
  });
});
