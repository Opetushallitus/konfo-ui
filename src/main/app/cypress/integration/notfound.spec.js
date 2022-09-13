import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import notfoundMocks from '#/cypress/mocks/notfound.mocks.json';

describe('404 page', () => {

  beforeEach(() => {
    playMocks(notfoundMocks);
  });

  it('404 when visiting koulutus that does not exist', () => {
    cy.visit('/fi/koulutus/1231231');
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('404');
  });

  it('404 when visiting toteutus that does not exist', () => {
    cy.visit('/fi/toteutus/1231231');
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('404');
  });
});
