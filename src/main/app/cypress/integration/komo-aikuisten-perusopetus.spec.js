import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komoAiperMocks from '#/cypress/mocks/komo-aikuisten-perusopetus.mocks.json';

describe('Aikuisten perusopetus KOMO', () => {
  beforeEach(() => {
    playMocks(komoAiperMocks);

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
  });

  it('renders perustiedot with koulutustyyppi and opintojenlaajuus', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000002339');
    cy.findByRole('heading', { name: 'Aikuisten perusopetus' }).should('exist');
    cy.findByLabelText('Koulutustyyppi').should('have.text', 'Aikuisten perusopetus');
    cy.findByLabelText('Koulutuksen laajuus').should('have.text', '18 viikkoa');
  });

  it('renders kuvaus without a link to ePerusteet', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000002339');
    cy.findByTestId('kuvaus').within(() => {
      cy.findByRole('heading', { name: 'Koulutuksen kuvaus' }).should('exist');
      cy.findByText('Ihan vaan peruskoulutus');
      cy.findByRole('link', { name: 'Lue lisää ePerusteet palvelussa' }).should(
        'not.exist'
      );
    });
  });

  it('renders kuvaus with a link to ePerusteet', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000002340');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByTestId('kuvaus').within(() => {
      cy.findByRole('link', { name: 'Lue lisää ePerusteet palvelussa' }).should('exist');
    });
  });
});
