import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komoTuvaMocks from '#/cypress/mocks/komo-aikuisten-perusopetus.mocks.json';

describe('Aikuisten perusopetus KOMO', () => {
  beforeEach(() => {
    playMocks(komoTuvaMocks);
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000002339');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
  });

  it('renders perustiedot with koulutustyyppi and opintojenlaajuus', () => {
    cy.findByRole('heading', {name: 'Aikuisten perusopetus'}).should('exist');
    cy.findByTestId('koulutustyyppi').contains('Aikuisten perusopetus');
    cy.findByTestId('opintojenLaajuus').contains('18 viikkoa');
  });

  it('renders kuvaus without a link to ePerusteet', () => {
    cy.findByTestId('kuvaus').within(() => {
      cy.get('h2').contains('Koulutuksen kuvaus');
      cy.findByText('Ihan vaan peruskoulutus');
      cy.findByRole('link', {name: 'Lue lisää ePerusteet palvelussa'}).should('not.exist');
    });
  });

  it('renders kuvaus with a link to ePerusteet', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000002340');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByTestId('kuvaus').within(() => {
      cy.findByTestId('eperuste-linkki').should('exist');
    });
  });
});
