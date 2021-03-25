import { configure } from '@testing-library/cypress';
import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import commonMocks from '#/cypress/mocks/common.mocks.json';
import './commands';

configure({ testIdAttribute: 'data-cy' });

beforeEach(() => {
  playMocks(commonMocks);
  cy.intercept('**/faq.e49945eb.svg', { fixture: 'faq.e49945eb.svg' });
  cy.intercept('**/ehoks.fdeaa517.svg', { fixture: 'ehoks.fdeaa517.svg' });
  cy.intercept('**/sv/translation.json', {});
  cy.intercept('https://fonts.googleapis.com/icon?family=Material+Icons', {
    fixture: 'material-icons.css',
  });
});
