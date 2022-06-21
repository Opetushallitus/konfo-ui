import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komoOsaamisalaMocks from '#/cypress/mocks/komo-osaamisala.mocks.json';

describe('Osaamisala KOMO', () => {
  beforeEach(() => {
    playMocks(komoOsaamisalaMocks);
  });
  it('Osaamisala KOMO renders properly', () => {
    cy.visit('/fi/koulutus/1.2.246.562.13.00000000000000000623');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('Hevosten kengittämisen osaamisala');
    cy.findByText('Osaamisala').should('exist');
    cy.findByText('100 osaamispistettä');
    cy.get('h3').contains('Tutkinnon suorittaneen osaaminen');
  });
});
