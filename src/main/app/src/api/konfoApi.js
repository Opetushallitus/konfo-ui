import axios from 'axios';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { urls } from 'oph-urls-js';
import qs from 'query-string';

import { getLanguage } from '#/src/tools/localization';
import { cleanRequestParams, isCypress } from '#/src/tools/utils';

const client = axios.create({
  headers: {
    'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
  },
});

client.interceptors.request.use((request) => {
  const { method } = request;
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrfCookie = Cookies.get('CSRF');
    if (csrfCookie) {
      request.headers.CSRF = csrfCookie;
    }
  }
  return request;
});

const get = async (url, config = {}) => {
  const response = await client.get(url, config);
  return response.data;
};

const createEntityGetter = (entityName) => (oid, draft) =>
  get(
    urls.url(`konfo-backend.${entityName}`, oid),
    draft ? { params: { draft: true } } : {}
  );

export const getConfiguration = () => {
  const { NODE_ENV } = process.env;
  if (['development', 'test'].includes(NODE_ENV) || isCypress) {
    return { naytaFiltterienHakutulosLuvut: true };
  } else {
    return get('/konfo/rest/config/configuration');
  }
};

export const getKoulutus = createEntityGetter('koulutus');

export const getKoulutusKuvaus = (ePerusteId) =>
  get(urls.url('konfo-backend.koulutus.kuvaus', ePerusteId));

export const getEperusteKuvaus = (ePerusteId) =>
  get(urls.url('konfo-backend.eperuste.kuvaus', ePerusteId));

export const getKoulutusJarjestajat = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.koulutus.jarjestajat', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getOppilaitos = createEntityGetter('oppilaitos');

export const getOppilaitosOsa = createEntityGetter('oppilaitosOsa');

export const getOppilaitosTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getOppilaitosOsaTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitosOsa.tarjonta', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getToteutus = createEntityGetter('toteutus');

export const getToteutusOsaamisalaKuvaus = ({ ePerusteId, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.kuvaus.osaamisalat', ePerusteId), {
      params: cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getHakukohde = createEntityGetter('hakukohde');

export const getHakukohdeDemo = async (hakukohdeOid) => {
  try {
    return await get(urls.url('konfo-backend.hakukohde.demo', hakukohdeOid));
  } catch {
    return { demoAllowed: false };
  }
};

export const getValintaperuste = createEntityGetter('valintaperusteet');

export const searchKoulutukset = (requestParams, signal) =>
  get(urls.url('konfo-backend.search.koulutukset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const searchOppilaitokset = (requestParams, signal) =>
  get(urls.url('konfo-backend.search.oppilaitokset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const postClientError = (errorData) =>
  client.post('/konfo-backend/client-error', errorData);

export const sendPalaute = ({ arvosana, palaute }) =>
  client({
    method: 'post',
    url: urls.url('konfo-backend.palaute'),
    data: qs.stringify({
      arvosana,
      palaute,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

export const getContentfulManifest = () =>
  axios.get(urls.url('konfo-backend.content', 'manifest.json'));

function reduceToKeyValue(values = []) {
  return values.reduce((res, value) => {
    res[value.id] = value;
    if (value.url) {
      res[value.url] = value;
    }
    if (value.slug) {
      res[value.slug] = value;
    }
    if (value.sivu?.id) {
      res[value.sivu.id] = value;
    }
    return res;
  }, {});
}

export const getContentfulData = (manifest, lang) => {
  return Promise.all(
    _.map(manifest?.data, (v, key) => {
      if (v[lang] === undefined) {
        console.log(
          'Sisältöä valitulle kielelle ei löydy! ' + JSON.stringify(v) + ', key ' + key
        );
        return null;
      }
      const url = urls.url('konfo-backend.content', '') + v[lang];
      return axios.get(url).then((res) => {
        return { [key]: reduceToKeyValue(res?.data) };
      });
    })
  ).then((all) => {
    const contentfulData = Object.assign({}, ...all);
    const slugsToIds = Object.fromEntries(
      _.values(contentfulData?.sivu).map((sivu) => [
        sivu.slug,
        { language: lang, id: sivu.id },
      ])
    );
    return { contentfulData, slugsToIds };
  });
};
