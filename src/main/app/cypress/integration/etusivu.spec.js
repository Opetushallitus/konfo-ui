describe('Etusivu', () => {
  it('Should have cards with working links', () => {
    cy.visit('/');

    cy.get('a[href*="/sivu/ammatillinen-koulutus"]').click();
    cy.get('h1').contains('Ammatillinen koulutus');
  });

  it('Should have skip to content link hidden by default', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Siirry sisältöön' })
      .should('have.css', 'z-index', '999')
      .and('have.css', 'left', '-9999px');
  });

  it('Should pass koulutustyyppi filter selection to haku page', () => {
    cy.intercept(
      {
        url: 'konfo-backend/search/oppilaitokset*',
      },
      {
        fixture: 'search-oppilaitokset-all.json',
      }
    );
    cy.intercept(
      {
        url: 'konfo-backend/search/koulutukset*',
      },
      {
        fixture: 'search-koulutukset-all.json',
      }
    );
    cy.visit('/');
    cy.findByRole('searchbox').type('auto');
    cy.findByRole('button', { name: /^Rajaa/ }).click();
    cy.findByTestId('valitse_koulutustyyppi').click();
    cy.findByLabelText('Lukiokoulutus').check();
    cy.get('body').type('{esc}');
    cy.get('body').type('{esc}');
    cy.findByRole('button', { name: 'Etsi' }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/konfo/fi/haku/auto');
      expect(loc.search).to.eq('?koulutustyyppi=lk&order=desc&size=20&sort=score');
    });
  });
});
