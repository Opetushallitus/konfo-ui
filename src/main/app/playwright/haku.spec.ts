import { test, expect } from '@playwright/test';

import {
  expectURLEndsWith,
  fixtureFromFile,
  getSearchButton,
  getSearchInput,
  mocksFromFile,
  setupCommonTest,
  getStylePropertyValue,
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
    const ylempiAmkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: /Ylemmät AMK-tutkinnot/i,
      exact: true,
    });

    const alempiAmkCheckbox = koulutustyyppiFilter.getByRole('checkbox', {
      name: 'AMK-tutkinnot',
      exact: true,
    });

    await koulutustyyppiFilter.getByTestId('show-more-amk').click();
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
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

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
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-auto.json')
    );
    await page.goto('/konfo/fi/haku');

    const valintatapaFilter = page.getByTestId('valintatapa-filter');
    const koepisteetChk = valintatapaFilter.getByRole('checkbox', {
      name: /Koepisteet/i,
    });
    const yhteispisteetChk = valintatapaFilter.getByRole('checkbox', {
      name: /Yhteispisteet/i,
    });

    const valintatapaButton = page.getByRole('button', { name: 'Valintatapa' });
    await expect(valintatapaButton).toBeVisible();
    await valintatapaButton.click();
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
    const hakuKaynnissaChk = hakukaynnissaFilter.getByRole('checkbox', {
      name: /Haku käynnissä/i,
    });

    await hakuKaynnissaChk.click();
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
    const yhteishakuChk = hakutapaFilter.getByRole('checkbox', { name: /Yhteishaku/i });
    const jatkuvaHakuChk = hakutapaFilter.getByRole('checkbox', {
      name: /Jatkuva haku/i,
    });

    const hakutapaButton = page.getByRole('button', { name: 'Hakutapa' });
    await expect(hakutapaButton).toBeVisible();
    await hakutapaButton.click();
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
    const ammatillinenPerustutkintoChk = pohjakoulutusVaatimusFilter.getByRole(
      'checkbox',
      {
        name: /Ammatillinen perustutkinto/i,
      }
    );
    const lukioChk = pohjakoulutusVaatimusFilter.getByRole('checkbox', {
      name: /Lukio/i,
    });
    const koulutustaustaButton = page.getByRole('button', { name: 'Koulutustausta' });
    await expect(koulutustaustaButton).toBeVisible();
    await koulutustaustaButton.click();

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

    const page2Button = page.getByRole('button', { name: '2', exact: true });
    await page2Button.scrollIntoViewIfNeeded();

    const transparent = 'rgba(0, 0, 0, 0)';
    const green = 'rgb(0, 128, 0)';
    let backgroundColorForPage2Button = await getStylePropertyValue(
      page2Button,
      'background-color'
    );
    // Paginaatio-elementin 2-sivu-buttonia ei ole vielä klikattu
    expect(backgroundColorForPage2Button).toBe(transparent);

    // Kuunnellaan backendiin lähteviä pyyntöjä: jos kyseiseen urliin ei lähde pyyntöä, tulee timeout ja testi failaa.
    // Pyynnössä täytyy olla parametrina page=2
    const requestPromise1 = page.waitForRequest(
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
    await requestPromise1;

    // 2-sivu-buttonin taustaväri on muuttunut vihreäksi mikä indikoi että ollaan 2. sivulla
    backgroundColorForPage2Button = await getStylePropertyValue(
      page2Button,
      'background-color'
    );
    expect(backgroundColorForPage2Button).toBe(green);

    // Tehdään haku hakusanalla "auto"
    const searchInput = getSearchInput(page);
    await searchInput.fill('auto');

    const searchButton = getSearchButton(page);
    await searchInput.scrollIntoViewIfNeeded();

    // Urlissa tällä kertaa page=1
    const requestPromise = page.waitForRequest(
      (request) => {
        return (
          request.url() ===
            'http://localhost:3005/konfo-backend/search/koulutukset?keyword=auto&lng=fi&order=desc&page=1&size=20&sort=score' &&
          request.method() === 'GET'
        );
      },
      { timeout: 5000 }
    );

    // Ennen hakunapin klikkausta 1-sivu-buttonin taustaväri on valkoinen
    const page1Button = page.getByRole('button', { name: '1', exact: true });
    let backgroundColorForPage1Button = await getStylePropertyValue(
      page1Button,
      'background-color'
    );
    expect(backgroundColorForPage1Button).toBe(transparent);

    await searchButton.click();
    await requestPromise;

    // Haun jälkeen taustaväri on vihreä
    backgroundColorForPage1Button = await getStylePropertyValue(
      page1Button,
      'background-color'
    );
    expect(backgroundColorForPage1Button).toBe(green);
  });
});
