import murupolkuMocks from '#/cypress/mocks/murupolku.mocks.json';
import { assertBreadcrumb, playMocks } from '#/cypress/utils';

describe('Murupolku', () => {
  beforeEach(() => {
    playMocks(murupolkuMocks);
  });

  it('Should show correct breadcrumb for a contentful page', () => {
    const url = '/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'Paikan vastaanotto ja ilmoittautuminen korkeakouluun',
      lastHrefContains: url,
      hasHakutuloksetLink: false,
    });
  });

  it('Should show correct breadcrumb for koulutus', () => {
    const url = '/fi/koulutus/1.2.246.562.13.00000000000000000570';
    cy.visit(url);

    assertBreadcrumb({
      length: 3,
      lastTextContains: 'Autoalan perustutkinto',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for toteutus', () => {
    const url = '/fi/toteutus/1.2.246.562.17.00000000000000000404';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'PetteriT:n testitoteutus',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for oppilaitos', () => {
    const url = '/fi/oppilaitos/1.2.246.562.10.56753942459';
    cy.visit(url);

    assertBreadcrumb({
      length: 3,
      lastTextContains: 'Aalto-yliopisto',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  // TODO: This fails with current data from hahtuva. Update mocks after fix is done.
  // See https://beta.hahtuvaopintopolku.fi/konfo-backend/search/oppilaitoksen-osa/1.2.246.562.10.76662434703/tarjonta
  it('Should show correct breadcrumb for oppilaitoksen osa', () => {
    const url = '/fi/oppilaitososa/1.2.246.562.10.61042218794';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'Aalto-yliopisto, Kauppakorkeakoulu',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for valintaperuste', () => {
    const url = '/fi/hakukohde/1.2.246.562.20.00000000000000000429/valintaperuste';
    cy.visit(url);

    assertBreadcrumb({
      length: 5,
      lastTextContains: 'valintaperuste',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });
});
