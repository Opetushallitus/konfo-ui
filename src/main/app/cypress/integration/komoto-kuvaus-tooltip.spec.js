import komotoKuvausTooltipMocks from '#/cypress/mocks/komoto-kuvaus-tooltip.mocks.json';
import { playMocks } from '#/cypress/utils';

describe('Kuvaus tooltip KOMOTO', () => {
  beforeEach(() => {
    playMocks(komotoKuvausTooltipMocks);
  });

  it('Suunniteltu kesto kuvaus KOMOTO renders properly', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000420');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByRole('tooltip').should('not.exist');
    cy.findByLabelText('Suunniteltu kesto')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button').click();
      });
    cy.findByRole('tooltip').within(() => {
      cy.get('a[href*="https://oph.fi"]').should('have.attr', 'target', '_blank');
    });
  });
});
