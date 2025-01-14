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
  SlugsToIds,
  SearchParams,
  Suosikki,
  VertailuSuosikki,
  HakukohdeSearchResult,
  HakukohdeSearchParams,
  Osaamismerkki,
} from '#/src/types/common';
import {
  ContentfulData,
  ContentfulManifestData,
  GenericContentfulItem,
} from '#/src/types/ContentfulTypes';

type RequestConfig = AxiosRequestConfig<RequestParams>;

const client = axios.create({
  headers: {
    'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, { encode: false, arrayFormat: 'comma' }),
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

export const getOsaamismerkki = async (
  osaamismerkkiKoodiUri?: string
): Promise<Osaamismerkki> => {
  return await get(urls.url('konfo-backend.osaamismerkki', osaamismerkkiKoodiUri));
};

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

export const getHaku = createEntityGetter<TODOType>('haku');

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

export const searchHakukohteet = (
  requestParams: HakukohdeSearchParams,
  signal?: AbortSignal
) =>
  get<HakukohdeSearchResult>(urls.url('konfo-backend.search.hakukohteet'), {
    params: { ...cleanRequestParams(requestParams) },
    signal,
  });

export const searchKoulutukset = (requestParams: SearchParams, signal?: AbortSignal) =>
  get(urls.url('konfo-backend.search.koulutukset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const searchOppilaitokset = (requestParams: SearchParams, signal?: AbortSignal) =>
  get(urls.url('konfo-backend.search.oppilaitokset'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
    signal,
  });

export const autoCompleteSearch = (requestParams: SearchParams) =>
  get<AutocompleteResult>(urls.url('konfo-backend.search.autocomplete'), {
    params: { lng: getLanguage(), ...cleanRequestParams(requestParams) },
  });

export const getHakukohdeSuosikit = (requestParams: {
  'hakukohde-oids': Array<string>;
}) => {
  return get<Array<Suosikki>>(urls.url('konfo-backend.suosikit'), {
    params: requestParams,
  });
};

export const getHakukohdeSuosikitVertailu = (requestParams: {
  'hakukohde-oids': Array<string>;
}) => {
  return get<Array<VertailuSuosikki>>(urls.url('konfo-backend.suosikit-vertailu'), {
    params: requestParams,
  });
};

export const postClientError = (errorData: {
  'error-message': string;
  url: string;
  line?: number;
  col?: number;
  'user-agent': string;
  stack?: string;
}) => client.post('/konfo-backend/client-error', errorData);

export const getContentfulManifest = async () =>
  (
    await axios.get<ContentfulManifestData>(
      urls.url('konfo-backend.content', 'manifest.json')
    )
  )?.data;

function reduceToKeyValue(contentfulRes: Array<GenericContentfulItem> = []) {
  return contentfulRes.reduce(
    (res, value) => {
      res[value.id] = value;
      if (value?.url) {
        res[value.url] = value;
      }
      if (value.slug) {
        res[value.slug] = value;
      }
      if (value.sivu?.id) {
        res[value.sivu.id] = value;
      }
      return res;
    },
    {} as Record<string, GenericContentfulItem>
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
      return axios.get<Array<GenericContentfulItem>>(url).then((res) => {
        return { [key]: reduceToKeyValue(res?.data) };
      });
    })
  ).then((all) => {
    const contentfulData: ContentfulData = Object.assign({}, ...all);
    const slugsToIds: SlugsToIds = Object.fromEntries(
      Object.values(contentfulData?.sivu ?? {}).map((sivu) => [
        sivu.slug!,
        { language: lang, id: sivu.id, englishPageVersionId: sivu.englishPageVersionId },
      ])
    );
    return { contentfulData, slugsToIds };
  });
};
