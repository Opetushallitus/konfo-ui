import { urls } from 'oph-urls-js';

import { isPlaywright, isDev } from './tools/utils';

// Muista lisätä myös spring-boot-sovellukseen uudet urlit

const CALLER_ID = '1.2.246.562.10.00000000001.konfoui';

const development = {
  'konfo-backend.base-url': '/',
  'konfo-backend.old-oppija-fi': '/',
  'konfo-backend.old-oppija-sv': '/sv/',
  'konfo-backend.old-oppija-en': '/en/',
  'konfo-backend.search.hakukohteet': '/konfo-backend/search/hakukohteet',
  'konfo-backend.search.koulutukset': '/konfo-backend/search/koulutukset',
  'konfo-backend.search.oppilaitokset': '/konfo-backend/search/oppilaitokset',
  'konfo-backend.search.autocomplete': '/konfo-backend/search/autocomplete',
  'konfo-backend.koulutus': '/konfo-backend/koulutus/$1',
  'konfo-backend.toteutus': '/konfo-backend/toteutus/$1',
  'konfo-backend.valintaperusteet': '/konfo-backend/valintaperuste/$1',
  'konfo-backend.oppilaitos': '/konfo-backend/oppilaitos/$1',
  'konfo-backend.oppilaitosOsa': '/konfo-backend/oppilaitoksen-osa/$1',
  'konfo-backend.kuvaus.osaamisalat': '/konfo-backend/kuvaus/$1/osaamisalat',
  'konfo-backend.palaute': '/konfo-backend/palaute',
  'konfo-backend.koulutus.jarjestajat': '/konfo-backend/search/koulutus/$1/jarjestajat',
  'konfo-backend.oppilaitos.tarjonta': '/konfo-backend/search/oppilaitos/$1/tarjonta',
  'konfo-backend.hakukohde': '/konfo-backend/hakukohde/$1',
  'konfo-backend.koodisto.koodit': '/konfo-backend/koodisto/$1/koodit',
  'konfo-backend.haku.demo': '/konfo-backend/haku/$1/demo',
  'konfo-backend.haku': '/konfo-backend/haku/$1',
  'konfo-backend.koulutus.kuvaus': '/konfo-backend/kuvaus/$1',
  'konfo-backend.eperuste.kuvaus': '/konfo-backend/eperuste/$1',
  'konfo-backend.suosikit': '/konfo-backend/suosikit',
  'konfo-backend.suosikit-vertailu': '/konfo-backend/suosikit-vertailu',
  'konfo-backend.content': 'https://konfo-content.untuvaopintopolku.fi/$1',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
  'eperusteet-service.eperuste.kuvaus':
    'https://eperusteet.opintopolku.fi/#/$1/esitys/$2/reformi/tutkinnonosat/$3',
  'eperusteet-service.eperuste.tiedot':
    'https://eperusteet.opintopolku.fi/#/$1/tiedot/$2',
  'oma-opintopolku': 'https://testiopintopolku.fi/oma-opintopolku',
  'ataru.hakemus-haku': 'https://testiopintopolku.fi/hakemus/haku/$1',
};

export const configureUrls = async () => {
  urls.addCallerId(CALLER_ID);
  if (isDev || isPlaywright) {
    urls.addProperties(development);
  } else {
    await urls.load('/konfo/rest/config/frontProperties');
  }
};
