import { configure } from '@testing-library/cypress';

import commonMocks from '#/cypress/mocks/common.mocks.json';

import './commands';
import { playMocks } from '../utils';

configure({ testIdAttribute: 'data-cy' });

beforeEach(() => {
  playMocks(commonMocks);
  cy.intercept('**/faq.e49945eb.svg', { fixture: 'faq.e49945eb.svg' });
  cy.intercept('**/ehoks.fdeaa517.svg', { fixture: 'ehoks.fdeaa517.svg' });
  cy.intercept('**/sv/translation.json', {});
  cy.intercept('https://occhat.elisa.fi/**', {});
  cy.setCookie('oph-mandatory-cookies-accepted', 'true'); //Hide cookie modal
});
