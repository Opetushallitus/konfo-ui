import komotoOsaamisalaMocks from '#/cypress/mocks/komoto-osaamisala.mocks.json';
import { playMocks } from '#/cypress/utils';

describe('Osaamisala KOMOTO', () => {
  beforeEach(() => {
    playMocks(komotoOsaamisalaMocks);
  });

  it('Osaamisala KOMOTO renders properly', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000471');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('Hevosten kengittämisen osaamisala');
    cy.findByText('100 osaamispistettä');
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
