import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komoTuvaMocks from '#/cypress/mocks/komo-tuva.mocks.json';

describe('Osaamisala KOMO', () => {
  beforeEach(() => {
    playMocks(komoTuvaMocks);
  });
  it('TUVA KOMO renders properly', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000000623');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('Tutkintokoulutukseen valmentava koulutus (TUVA)');
    cy.findByTestId('koulutustyyppi').contains(
      'Tutkintokoulutukseen valmentava koulutus'
    );
    cy.findByTestId('opintojenLaajuus').contains('38 viikkoa');
  });
});
