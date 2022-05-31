import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import hakuMocks from '#/cypress/mocks/haku.mocks.json';

describe('Haku', () => {
  beforeEach(() => {
    playMocks(hakuMocks);
    cy.intercept(
      {
        url: 'konfo-backend/search/oppilaitokset*',
        query: {
          keyword: 'auto',
          koulutustyyppi: '',
        },
      },
      {
        fixture: 'search-oppilaitokset-auto.json',
      }
    );
    cy.intercept(
      {
        url: 'konfo-backend/search/koulutukset*',
        query: {
          keyword: 'auto',
          koulutustyyppi: '',
        },
      },
      {
        fixture: 'search-koulutukset-auto.json',
      }
    );
    cy.visit('/fi/haku/auto');
    cy.findAllByRole('progressbar').should('not.exist');
  });

  it('Koulutustyyppi checkboxes should work hierarchically', () => {
    cy.findByTestId('koulutustyyppi-filter').within(() => {
      cy.findByRole('checkbox', { name: /Ammatillinen koulutus/ }).as(
        'AmmatillinenKoulutus'
      );
      cy.findByRole('checkbox', { name: /Ammatillinen perustutkinto/ }).as(
        'AmmatillinenPerustutkinto'
      );
      cy.findByRole('checkbox', { name: /Ammattitutkinto/ }).as('Ammattitutkinto');
      cy.findByRole('checkbox', { name: /Erikoisammattitutkinto/ }).as(
        'Erikoisammattitutkinto'
      );

      cy.get('@AmmatillinenKoulutus').check();
      cy.get('@AmmatillinenPerustutkinto').should('be.checked');
      cy.get('@Ammattitutkinto').should('be.checked');
      cy.get('@Erikoisammattitutkinto').should('be.checked');

      cy.get('@AmmatillinenKoulutus').uncheck();
      cy.get('@AmmatillinenPerustutkinto').should('not.be.checked');
      cy.get('@Ammattitutkinto').should('not.be.checked');
      cy.get('@Erikoisammattitutkinto').should('not.be.checked');

      cy.get('@AmmatillinenPerustutkinto').check();
      cy.get('@AmmatillinenKoulutus').should('have.attr', 'data-indeterminate');

      cy.get('@Ammattitutkinto').check();
      cy.get('@Erikoisammattitutkinto').check();

      cy.get('@AmmatillinenKoulutus').should('be.checked');
    });
  });
  it("Koulutustyyppi switching between 'Tutkintoon johtavat' and 'Muut'", () => {
    const tutkintoonJohtavatBtn = () =>
      cy.findByRole('button', { name: /Tutkintoon johtavat/i });
    const muutBtn = () => cy.findByRole('button', { name: /Muut/i });
    const ammatillinenKoulutusChk = () =>
      cy.findByRole('checkbox', { name: /Ammatillinen koulutus/ });
    const ammatillinenPerustutkintoChk = () =>
      cy.findByRole('checkbox', { name: /Ammatillinen perustutkinto/i });
    const erikoisammattitutkintoChk = () =>
      cy.findByRole('checkbox', { name: /Erikoisammattitutkinto/i });
    const tutkinnonOsaChk = () => cy.findByRole('checkbox', { name: /Tutkinnon osa/i });
    const osaamisalaChk = () => cy.findByRole('checkbox', { name: /Osaamisala/i });
    const ammMuuChk = () =>
      cy.findByRole('checkbox', { name: /Muu ammatillinen koulutus/i });
    const telmaChk = () => cy.findByRole('checkbox', { name: /TELMA/ });

    cy.findByTestId('koulutustyyppi-filter').within(() => {
      ammatillinenKoulutusChk().should('exist');
      ammatillinenPerustutkintoChk().should('exist');
      erikoisammattitutkintoChk().should('exist');

      tutkintoonJohtavatBtn().should('have.attr', 'aria-selected', 'true');
      muutBtn().should('have.attr', 'aria-selected', 'false');

      muutBtn().click().should('have.attr', 'aria-selected', 'true');
      tutkintoonJohtavatBtn().should('have.attr', 'aria-selected', 'false');
      tutkinnonOsaChk().should('exist');
      osaamisalaChk().should('exist');
      ammMuuChk().should('exist');
      telmaChk().should('exist');
      ammatillinenPerustutkintoChk().should('not.exist');
      erikoisammattitutkintoChk().should('not.exist');

      tutkinnonOsaChk().check().should('be.checked');
      ammatillinenKoulutusChk().should('have.attr', 'data-indeterminate', 'true');
      osaamisalaChk().should('not.be.checked');
      ammMuuChk().should('not.be.checked');
      telmaChk().should('not.be.checked');

      osaamisalaChk().check().should('be.checked');
      ammatillinenKoulutusChk().should('have.attr', 'data-indeterminate', 'true');
      tutkinnonOsaChk().check().should('be.checked');
      ammMuuChk().should('not.be.checked');
      telmaChk().should('not.be.checked');

      ammMuuChk().check().should('be.checked');
      ammatillinenKoulutusChk().should('have.attr', 'data-indeterminate', 'true');
      tutkinnonOsaChk().should('be.checked');
      osaamisalaChk().should('be.checked');
      telmaChk().should('not.be.checked');

      telmaChk().check().should('be.checked');
      ammatillinenKoulutusChk()
        .should('be.checked')
        .should('have.attr', 'data-indeterminate', 'false');
      tutkinnonOsaChk().should('be.checked');
      osaamisalaChk().should('be.checked');
      ammMuuChk().should('be.checked');
    });
  });
  it('Koulutusala checkboxes should work hierarchically', () => {
    cy.findByText('Koulutusalat').should('exist');

    const tekniikanAlatChk = () => cy.findByRole('checkbox', { name: /Tekniikan alat/i });
    const arkkitehtuuriJaRakentaminen = () =>
      cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen/i });
    const materiaaliJaProsessitekniikka = () =>
      cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka/i });
    const koneProsessiEnergiaSahkoTekniikka = () =>
      cy.findByRole('checkbox', {
        name: /Kone-, prosessi-, energia- ja sähkötekniikka/i,
      });
    cy.findByTestId('koulutusalat-filter')
      .should('exist')
      .within(() => {
        tekniikanAlatChk().should('exist').check();

        cy.findByTestId(
          'show-more-kansallinenkoulutusluokitus2016koulutusalataso1_07'
        ).click(); // tekniikanAlat koodiUri

        tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'false');
        arkkitehtuuriJaRakentaminen().should('be.checked');
        koneProsessiEnergiaSahkoTekniikka().should('be.checked');
        materiaaliJaProsessitekniikka().should('be.checked').uncheck();

        tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'true');
        arkkitehtuuriJaRakentaminen().should('be.checked');
        materiaaliJaProsessitekniikka().should('not.be.checked');
        koneProsessiEnergiaSahkoTekniikka().should('be.checked');

        arkkitehtuuriJaRakentaminen().check();

        tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'true');
        arkkitehtuuriJaRakentaminen().should('be.checked');
        koneProsessiEnergiaSahkoTekniikka().should('be.checked');
        materiaaliJaProsessitekniikka().should('not.be.checked').check();

        tekniikanAlatChk()
          .should('be.checked')
          .should('have.attr', 'data-indeterminate', 'false');
        arkkitehtuuriJaRakentaminen().should('be.checked');
        materiaaliJaProsessitekniikka().should('be.checked');
        koneProsessiEnergiaSahkoTekniikka().should('be.checked');
      });
  });
  it('Opetustapa filter checkboxes and mobile summary view', () => {
    const etaopetusChk = () => cy.findByRole('checkbox', { name: /Etäopetus/i });
    const verkkoOpiskeluChk = () =>
      cy.findByRole('checkbox', { name: /Verkko-opiskelu/i });
    cy.findByText('Opetustapa').should('exist').click();
    cy.findByTestId('opetustapa-filter')
      .should('exist')
      .within(() => {
        etaopetusChk().click().should('be.checked');
        etaopetusChk().click().should('not.be.checked');
        verkkoOpiskeluChk().click().should('be.checked');
      });
    cy.findByTestId('chip-opetuspaikkakk_3')
      .should('exist')
      .within(() => {
        cy.get('svg').should('exist').click();
      });
    cy.findByTestId('opetustapa-filter')
      .should('exist')
      .within(() => {
        verkkoOpiskeluChk().should('exist').should('not.be.checked');
      });
  });

  it('Valintatapa filter checkboxes', () => {
    const koepisteetChk = () => cy.findByRole('checkbox', { name: /Koepisteet/i });
    const yhteispisteetChk = () => cy.findByRole('checkbox', { name: /Yhteispisteet/i });
    cy.findByText('Valintatapa').should('exist');
    cy.findByTestId('valintatapa-filter')
      .should('exist')
      .within(() => {
        koepisteetChk().click().should('be.checked');
        koepisteetChk().click().should('not.be.checked');
        yhteispisteetChk().click().should('be.checked');
      });
    cy.findByTestId('chip-valintatapajono_yp')
      .should('exist')
      .within(() => {
        cy.get('svg').should('exist').click();
      });
    cy.findByTestId('valintatapa-filter')
      .should('exist')
      .within(() => {
        yhteispisteetChk().should('exist').should('not.be.checked');
      });
  });

  it('Hakutapa filter checkboxes', () => {
    const yhteishakuChk = () => cy.findByRole('checkbox', { name: /Yhteishaku/i });
    const jatkuvaHakuChk = () => cy.findByRole('checkbox', { name: /Jatkuva haku/i });
    cy.findByText('Hakutapa').should('exist');
    cy.findByTestId('hakutapa-filter')
      .should('exist')
      .within(() => {
        jatkuvaHakuChk().click().should('be.checked');
        jatkuvaHakuChk().click().should('not.be.checked');
        yhteishakuChk().click().should('be.checked');
      });
    cy.findByTestId('chip-hakutapa_01')
      .should('exist')
      .within(() => {
        cy.get('svg').should('exist').click();
      });
    cy.findByTestId('hakutapa-filter')
      .should('exist')
      .within(() => {
        yhteishakuChk().should('exist').should('not.be.checked');
      });
  });

  it('Pohjakoulutusvaatimus filter checkboxes', () => {
    const ammatillinnePerustutkintoChk = () =>
      cy.findByRole('checkbox', { name: /Ammatillinen perustutkinto/i });
    const lukioChk = () => cy.findByRole('checkbox', { name: /Lukio/i });
    cy.findByText('Koulutustausta').should('exist');
    cy.findByTestId('pohjakoulutusvaatimus-filter')
      .should('exist')
      .within(() => {
        ammatillinnePerustutkintoChk().click().should('be.checked');
        ammatillinnePerustutkintoChk().click().should('not.be.checked');
        lukioChk().click().should('be.checked');
      });
    cy.findByTestId('chip-pohjakoulutusvaatimuskonfo_002')
      .should('exist')
      .within(() => {
        cy.get('svg').should('exist').click();
      });
    cy.findByTestId('pohjakoulutusvaatimus-filter')
      .should('exist')
      .within(() => {
        lukioChk().should('exist').should('not.be.checked');
      });
  });
  it("Koulutuskortti data should be presented correctly for 'Tutkinnon osa'", () => {
    const searchBox = () =>
      cy.findByRole('searchbox', { name: /etsi koulutuksia tai oppilaitoksia/i });
    const searchButton = () => cy.findByRole('button', { name: /etsi/i });

    searchBox().type('{selectall}').type('Hevosten hyvinvoinnista huolehtiminen');
    searchButton().click();
    cy.findByTestId('Hevosten hyvinvoinnista huolehtiminen').within(() => {
      cy.findByText('Tutkinnon osa').should('exist');
      cy.findByText('25 + 50 osaamispistettä').should('exist');
    });
  });
  it("Koulutuskortti data should be presented correctly for 'Osaamisala'", () => {
    const searchBox = () =>
      cy.findByRole('searchbox', { name: /etsi koulutuksia tai oppilaitoksia/i });
    const searchButton = () => cy.findByRole('button', { name: /etsi/i });

    searchBox().type('{selectall}').type('Jalkojenhoidon osaamisala');
    searchButton().click();
    cy.findByTestId('Jalkojenhoidon osaamisala').within(() => {
      cy.findByText('Osaamisala').should('exist');
      cy.findByText('145 osaamispistettä').should('exist');
    });
  });
});
