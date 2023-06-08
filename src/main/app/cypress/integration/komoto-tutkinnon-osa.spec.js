import komotoTutkinnonOsaMocks from '#/cypress/mocks/komoto-tutkinnon-osa.mocks.json';
import { playMocks } from '#/cypress/utils';

describe('Tutkinnon osa KOMOTO', () => {
  beforeEach(() => {
    playMocks(komotoTutkinnonOsaMocks);
  });

  it('Tutkinnon osa KOMOTO renders properly', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000469');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('(testi) Hevosten hyvinvoinnista huolehtiminen');
    cy.findByText('25 + 20 osaamispistettä');
    cy.get('h2').contains('Ilmoittaudu koulutukseen');
    cy.findByRole('link', { name: /ilmoittaudu koulutukseen/i }).should(
      'have.attr',
      'href',
      'http://www.google.fi'
    );
  });

  it('Tutkinnon osa KOMO kuvaus accordions work', () => {
    cy.get('a[href*="tutkinnonosat/2449201"]').should('not.exist');
    cy.get('[aria-expanded=false]').contains('Lisätietoa ilmoittautumisesta').click();
    cy.get('[aria-expanded=true]').contains('Lisätietoa ilmoittautumisesta');
  });
});
