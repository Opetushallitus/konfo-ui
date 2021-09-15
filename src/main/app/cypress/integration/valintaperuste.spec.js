import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import valintaperusteMocks from '#/cypress/mocks/valintaperuste.mocks.json';

describe('Valintaperuste page', () => {
  beforeEach(() => {
    playMocks(valintaperusteMocks);
  });

  it('Valintaperuste-page renders properly', () => {
    cy.visit('/fi/hakukohde/1.2.246.562.20.00000000000000000191/valintaperuste');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByRole('heading', { level: 3, name: /kielikoe/ });
    cy.findByRole('heading', { level: 3, name: /Annikan pääsykoe/ });
    cy.findByRole('heading', { level: 3, name: /lisäpiste urheilijalle/ });

    cy.findByRole('button', { name: /Tilaisuus 1/ }).click();
  });
});
