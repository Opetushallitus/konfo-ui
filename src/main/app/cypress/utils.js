import { isEqual } from 'lodash';

const findBreadcrumbItems = () => {
  return cy.findByRole('navigation', { name: 'Murupolku' }).find('li');
};

export const assertBreadcrumb = ({ length, lastHrefContains, hasHakutuloksetLink }) => {
  findBreadcrumbItems().should('have.length', length);

  findBreadcrumbItems()
    .last()
    .findByRole('link')
    .should(($link) => {
      expect($link.attr('href')).to.include(lastHrefContains);
    });

  if (hasHakutuloksetLink) {
    findBreadcrumbItems()
      .eq(1)
      .should('contain', 'Hakutulokset')
      .findByRole('link')
      .should(($link) => {
        expect($link.attr('href')).to.include('/konfo/fi/haku');
      });
  }
};

export const findSearchInput = () =>
  cy.findByPlaceholderText('Etsi koulutuksia tai oppilaitoksia');

export const playMocks = (mockData) =>
  mockData.forEach(({ url, method = 'GET', body, response }) => {
    // cy.intercept doesn't match urls with hash, so let's cut it out.
    const matchUrl = url.split('#')[0];
    cy.intercept(method, matchUrl, (req) => {
      // Check that the url match is exact (otherwise urls are partially matched)
      // and that body matches the one from mock if defined
      if (matchUrl === req.url && (body === undefined || isEqual(body, req.body))) {
        req.reply({
          statusCode: response.status,
          body: response.body,
        });
      }
    });
  });
