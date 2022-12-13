import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import komotoPistelaskuriMocks from '#/cypress/mocks/komoto-pistelaskuri.mocks.json';

describe('Pistelaskuri KOMOTO', () => {
  beforeEach(() => {
    playMocks(komotoPistelaskuriMocks);
  });

  it('Pistelaskuri KOMOTO renders properly', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000005700');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('.PisteContainer__infobox').contains(
      'Edellisvuosien alin hyväksytty pistemäärä, jolla oppilaitokseen on päässyt opiskelemaan.'
    );
    cy.get('#mui-component-select-hakukohde-select').contains('Lukion yleislinja');
  });

  it('Shows keskiarvo dialog', () => {
    cy.get('.PisteContainer__openbutton').click();
    cy.get('.KeskiarvoModal__container h2').contains('Hakupistelaskuri');
    cy.get('.KeskiarvoModal__container h3').contains('Peruskoulun keskiarvot');
  });

  it('Shows result after filling keskiarvot', () => {
    cy.get('.keskiarvo__laskuri__input').eq(0).type(8);
    cy.get('.keskiarvo__laskuri__input').eq(1).type(9);
    cy.get('.keskiarvo__laskuri__input').eq(2).type(6);
    cy.get('.KeskiarvoModal__calculatebutton').click();
    cy.get('.keskiarvo__tulos__sphere').eq(0).contains(8);
    cy.get('.keskiarvo__tulos__sphere').eq(1).contains(18);
    cy.get('.keskiarvo__tulos__sphere').eq(2).contains(16);
  });
});
