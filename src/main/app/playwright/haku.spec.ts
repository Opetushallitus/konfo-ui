import { test, expect } from '@playwright/test';

import {
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

    await page.goto('/konfo/fi/haku');
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
    await page.waitForURL(
      new RegExp('/konfo/fi/haku/auto\\?order=desc&size=20&sort=score')
    );
    await expect(page.getByRole('progressbar').last()).toBeHidden();
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('oppilaitos nimi fi').click();
    await expect(page).toHaveURL(new RegExp('/konfo/fi/oppilaitos/654321$'));
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await getSearchInput(page).click();
    await oppilaitoksetNav.getByText('Näytä 1 hakuehdoilla löytyvä oppilaitos').click();
    await page.waitForURL(
      new RegExp('/konfo/fi/haku/auto\\?order=desc&size=20&sort=score&tab=oppilaitos$')
    );
  });

  test('Koulutustyyppi checkboxes should work hierarchically', async ({ page }) => {
    test.slow();
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );

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
