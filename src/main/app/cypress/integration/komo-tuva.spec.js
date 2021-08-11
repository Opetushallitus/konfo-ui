import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komoTuvaMocks from '#/cypress/mocks/komo-tuva.mocks.json';

describe('TUVA KOMO', () => {
  beforeEach(() => {
    playMocks(komoTuvaMocks);
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000000623');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
  });

  it('renders perustiedot with koulutustyyppi and opintojenlaajuus', () => {
    cy.get('h1').contains('Tutkintokoulutukseen valmentava koulutus (TUVA)');
    cy.findByTestId('koulutustyyppi').contains(
      'Tutkintokoulutukseen valmentava koulutus'
    );
    cy.findByTestId('opintojenLaajuus').contains('38 viikkoa');
  });

  it('renders kuvaus without a link to ePerusteet', () => {
    cy.findByTestId('kuvaus').within(() => {
      cy.get('h2').contains('Koulutuksen kuvaus');
      cy.findByText('Tämä on kuvaus fi.');
      cy.findByTestId('eperuste-linkki').should('not.exist');
    });
  });

  it('renders kuvaus with a link to ePerusteet', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000000624');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByTestId('kuvaus').within(() => {
      cy.findByTestId('eperuste-linkki').should('exist');
    });
  });
});
