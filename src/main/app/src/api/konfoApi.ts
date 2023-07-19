import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { includes, isEmpty, map } from 'lodash';
import { urls } from 'oph-urls-js';
import qs from 'query-string';

import { getLanguage } from '#/src/tools/localization';
import { cleanRequestParams, isPlaywright, isDev } from '#/src/tools/utils';
import {
  AutocompleteResult,
  Koodi,
  LanguageCode,
  TODOType,
  RequestParams,
} from '#/src/types/common';
import {
  ContentfulData,
  ContentfulItem,
  ContentfulManifestData,
} from '#/src/types/ContentfulTypes';

type RequestConfig = AxiosRequestConfig<RequestParams>;

const client = axios.create({
  headers: {
    'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
  },
});

client.interceptors.request.use(
  (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (includes(['post', 'put', 'patch', 'delete'], request.method)) {
      const csrfCookie = Cookies.get('CSRF');
      if (csrfCookie && !isEmpty(csrfCookie)) {
        Object.assign(request.headers, { CSRF: csrfCookie });
      }
    }
    return request;
  }
);

const get = async <T = unknown>(url: string, config: RequestConfig = {}) => {
  const response = await client.get<T>(url, config);
  return response.data;
};

const createEntityGetter =
  <T = unknown>(entityName: string) =>
  (oid: string, draft?: boolean) =>
    get<T>(
      urls.url(`konfo-backend.${entityName}`, oid),
      draft ? { params: { draft: true } } : {}
    );

export const getConfiguration = () => {
  if (isDev || isPlaywright) {
    return { naytaFiltterienHakutulosLuvut: true };
  } else {
    return get('/konfo/rest/config/configuration');
  }
};

export const getKoulutus = createEntityGetter<TODOType>('koulutus');

export const getKoulutusKuvaus = (ePerusteId: string) =>
  get(urls.url('konfo-backend.koulutus.kuvaus', ePerusteId));

export const getEperusteKuvaus = (ePerusteId?: string) =>
  get(urls.url('konfo-backend.eperuste.kuvaus', ePerusteId));

export const getKoulutusJarjestajat = ({
  oid,
  requestParams,
}: {
  oid: string;
  requestParams: RequestParams;
}) =>
  get(urls.url('konfo-backend.koulutus.jarjestajat', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getOppilaitos = createEntityGetter<TODOType>('oppilaitos');

export const getOppilaitosOsa = createEntityGetter<TODOType>('oppilaitosOsa');

export const getOppilaitosTarjonta = ({
  oid,
  requestParams,
}: {
  oid: string;
  requestParams: RequestParams;
}) =>
  get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getOppilaitosOsaTarjonta = ({
  oid,
  requestParams,
}: {
  oid: string;
  requestParams: RequestParams;
}) =>
  get(urls.url('konfo-backend.oppilaitosOsa.tarjonta', oid), {
    params: cleanRequestParams(requestParams),
  });

export const getToteutus = createEntityGetter<TODOType>('toteutus');

export const getToteutusOsaamisalaKuvaus = ({
  ePerusteId,
  requestParams,
}: {
  ePerusteId: string;
  requestParams: RequestParams;
}) => {
  return client
    .get(urls.url('konfo-backend.kuvaus.osaamisalat', ePerusteId), {
      params: cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getHakukohde = createEntityGetter<TODOType>('hakukohde');

export const getHakuDemo = async (hakuOid: string) => {
  try {
    return await get<{ demoAllowed: boolean }>(
      urls.url('konfo-backend.haku.demo', hakuOid)
    );
  } catch {
    return { demoAllowed: false };
  }
};

export const getKoodistonKoodit = async (koodisto: string) => {
  return await get<Array<Koodi>>(urls.url('konfo-backend.koodisto.koodit', koodisto));
};

export const getValintaperuste = createEntityGetter('valintaperusteet');

export const searchKoulutukset = (requestParams: RequestParams, signal?: AbortSignal) =>
  get(urls.url('konfo-backend.search.koulutukset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const searchOppilaitokset = (requestParams: RequestParams, signal?: AbortSignal) =>
  get(urls.url('konfo-backend.search.oppilaitokset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const autoCompleteSearch = (requestParams: RequestParams) =>
  get<AutocompleteResult>(urls.url('konfo-backend.search.autocomplete'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
  });

export const postClientError = (errorData: {
  'error-message': string;
  url: string;
  line?: number;
  col?: number;
  'user-agent': string;
  stack?: string;
}) => client.post('/konfo-backend/client-error', errorData);

export const sendPalaute = ({
  arvosana,
  palaute,
}: {
  arvosana: number;
  palaute: string;
}) =>
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

export const getContentfulManifest = async () =>
  (
    await axios.get<ContentfulManifestData>(
      urls.url('konfo-backend.content', 'manifest.json')
    )
  )?.data;

function reduceToKeyValue(contentfulRes: Array<ContentfulItem> = []) {
  return contentfulRes.reduce(
    (res, value) => {
      res[value.id] = value;
      if (value.url) {
        res[value.url] = value;
      }
      if (value.slug) {
        res[value.slug] = value;
      }
      // lehti.json:ssa on "sivu"-kenttä
      if (value.sivu?.id) {
        res[value.sivu.id] = value;
      }
      return res;
    },
    {} as Record<string, ContentfulItem>
  );
}

export const getContentfulData = (
  manifestData: ContentfulManifestData,
  lang: LanguageCode
) => {
  return Promise.all(
    map(manifestData, (v, key) => {
      if (v[lang] === undefined) {
        console.log(
          'Sisältöä valitulle kielelle ei löydy! ' + JSON.stringify(v) + ', key ' + key
        );
        return null;
      }
      const url: string = urls.url('konfo-backend.content', '') + v[lang];
      return axios.get<Array<ContentfulItem>>(url).then((res) => {
        return { [key]: reduceToKeyValue(res?.data) };
      });
    })
  ).then((all) => {
    const contentfulData: ContentfulData = Object.assign({}, ...all);
    const slugsToIds: Record<string, { language: LanguageCode; id: string }> =
      Object.fromEntries(
        Object.values(contentfulData?.sivu ?? {}).map((sivu) => [
          sivu.slug!,
          { language: lang, id: sivu.id },
        ])
      );
    return { contentfulData, slugsToIds };
  });
};
