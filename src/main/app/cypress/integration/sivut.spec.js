describe('Sivut', () => {
  it('Language change should be reflected in URL and page content', () => {
    cy.visit('/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun');
    cy.findAllByRole('progressbar').should('not.exist');

    cy.findByRole('heading', {
      name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
    });
    cy.findByRole('button', { name: /fi/i }).click();
    cy.findByRole('option', { name: /på svenska/i }).click();

    cy.findByRole('heading', {
      name: /mottagande av studieplats i gemensam ansökan och anmälning till högskolor/i,
    });
    cy.url().should(
      'include',
      '/sv/sivu/mottagande-av-studieplats-i-gemensam-ansoekan-och-anmaelning-till-hoegskolor'
    );

    cy.go('back');

    cy.findAllByRole('progressbar').should('not.exist');

    cy.url().should(
      'include',
      '/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun'
    );
    cy.findByRole('heading', {
      name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
    });

    cy.viewport('samsung-s10');
    cy.findByRole('button', { name: /Avaa tai sulje valikko/i }).click();
    cy.findByRole('tab', { name: /på svenska/i }).click({ force: true });

    cy.findAllByRole('progressbar').should('not.exist');

    cy.url().should(
      'include',
      '/sv/sivu/mottagande-av-studieplats-i-gemensam-ansoekan-och-anmaelning-till-hoegskolor'
    );
    cy.findByRole('menuitem', { name: 'Sökandes hälsa och funktionsförmåga' }).click();
    cy.url().should('include', '/sv/sivu/soekandes-haelsa-och-funktionsfoermaga');
  });
});
