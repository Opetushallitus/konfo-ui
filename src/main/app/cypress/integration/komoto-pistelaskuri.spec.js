import komotoPistelaskuriMocks from '#/cypress/mocks/komoto-pistelaskuri.mocks.json';
import { playMocks } from '#/cypress/utils';

describe('Pistelaskuri KOMOTO', () => {
  beforeEach(() => {
    playMocks(komotoPistelaskuriMocks);
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000005700');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
  });

  it('Pistelaskuri KOMOTO renders properly', () => {
    cy.get('.PisteContainer__infobox').contains(
      'Edellisvuosien alin hyväksytty pistemäärä, jolla oppilaitokseen on päässyt opiskelemaan.'
    );
    cy.get('#mui-component-select-hakukohde-select').contains('Lukion yleislinja');
  });

  it('Shows keskiarvo dialog', () => {
    cy.get('.PisteContainer__openbutton').click();
    cy.get('.KeskiarvoModal__container h2').contains('Valintapistelaskuri');
    cy.get('.KeskiarvoModal__container h3').contains('Perusopetuksen keskiarvot');
  });

  it('Shows keskiarvo, kouluaine and osalaskut remembering previous result', () => {
    cy.get('.PisteContainer__openbutton').click();
    cy.get('.keskiarvo__laskuri__input').eq(0).type(8);
    cy.get('.keskiarvo__laskuri__input').eq(1).type(9);
    cy.get('.keskiarvo__laskuri__input').eq(2).type(6);
    cy.get('.KeskiarvoModal__calculatebutton').click();
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(0).contains(8);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(1).contains(18);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(2).contains(16);

    //Shows result after filling kouluaine
    cy.get('.KeskiarvoModal__recalculatebutton').click();
    cy.get('.KeskiarvoModal__container button').eq(0).click();
    cy.get('.KeskiarvoModal__container .kouluaine__gradeselect').eq(0).click();
    cy.get('.MuiPopover-root li').eq(1).click();
    cy.get('.KeskiarvoModal__calculatebutton').click();
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(0).contains(10);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(1).contains(24);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(2).contains(22);

    // Shows osalaskut
    cy.get('.keskiarvo__tulos__osalaskut__section .keskiarvo__tulos__textblock')
      .eq(0)
      .contains('16 / 16');
    cy.get('.keskiarvo__tulos__osalaskut__section .keskiarvo__tulos__textblock')
      .eq(1)
      .contains('0 / 8');
    cy.get('.keskiarvo__tulos__osalaskut__section .keskiarvo__tulos__textblock')
      .eq(2)
      .contains('6 / 6');
    cy.get('.keskiarvo__tulos__osalaskut__section .keskiarvo__tulos__textblock')
      .eq(3)
      .contains('2');

    // Remembers previous result
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(0).contains(10);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(1).contains(24);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(2).contains(22);

    // Removes previous result
    cy.get('.KeskiarvoModal__calculatebutton').click();
    cy.get('.PisteContainer__purifybutton').click();
    cy.get('.PisteContainer__openbutton').click();
    cy.get('.KeskiarvoModal__container h2').contains('Valintapistelaskuri');
    cy.get('.KeskiarvoModal__container h3').contains('Perusopetuksen keskiarvot');
    cy.get('.keskiarvo__tulos__pallerot__pallero').should('not.exist');
  });

  it('Shows result without suoritettu checked', () => {
    cy.get('.PisteContainer__openbutton').click();
    cy.get('.keskiarvo__laskuri__input').eq(0).type(8);
    cy.get('.keskiarvo__laskuri__input').eq(1).type(9);
    cy.get('.keskiarvo__laskuri__input').eq(2).type(6);
    cy.get('.MuiCheckbox-root input').click();
    cy.get('.KeskiarvoModal__calculatebutton').click();
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(0).contains(8);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(1).contains(12);
    cy.get('.keskiarvo__tulos__pallerot__pallero').eq(2).contains(10);
  });
});
