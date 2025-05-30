import { createSelector } from '@reduxjs/toolkit';
import { pick, some, size as _size, concat, keys, includes } from 'lodash';
import qs from 'query-string';

import { RAJAIN_TYPES_ARR } from '#/src/constants';
import { RootState } from '#/src/store';
import {
  cleanRequestParams,
  getPaginationPage,
  safeParseNumber,
} from '#/src/tools/utils';

// State data getters
export const getKeyword = (state: RootState) => state.hakutulos.keyword;

export const getKoulutusOffset = (state: RootState) => state.hakutulos.koulutusOffset;

export const getOppilaitosOffset = (state: RootState) => state.hakutulos.oppilaitosOffset;

const getOpetuskieli = (state: RootState) => state.hakutulos.opetuskieli;
const getOpetusaika = (state: RootState) => state.hakutulos.opetusaika;
const getKoulutustyyppi = (state: RootState) => state.hakutulos.koulutustyyppi;
const getKoulutusala = (state: RootState) => state.hakutulos.koulutusala;
const getKunta = (state: RootState) => state.hakutulos.kunta;
const getMaakunta = (state: RootState) => state.hakutulos.maakunta;
const getOpetustapa = (state: RootState) => state.hakutulos.opetustapa;
const getKoulutuksenKestoKuukausina = (state: RootState) =>
  state.hakutulos.koulutuksenkestokuukausina;
const getValintatapa = (state: RootState) => state.hakutulos.valintatapa;
const getHakukaynnissa = (state: RootState) => state.hakutulos.hakukaynnissa;
const getHakutapa = (state: RootState) => state.hakutulos.hakutapa;
const getYhteishaku = (state: RootState) => state.hakutulos.yhteishaku;
const getPohjakoulutusvaatimus = (state: RootState) =>
  state.hakutulos.pohjakoulutusvaatimus;
const getJotpa = (state: RootState) => state.hakutulos.jotpa;
const getTyovoimakoulutus = (state: RootState) => state.hakutulos.tyovoimakoulutus;
const getTaydennyskoulutus = (state: RootState) => state.hakutulos.taydennyskoulutus;
const getAlkamiskausi = (state: RootState) => state.hakutulos.alkamiskausi;
const getMaksullisuustyyppi = (state: RootState) => state.hakutulos.maksullisuustyyppi;
const getMaksunmaara = (state: RootState) => state.hakutulos.maksunmaara;
const getLukuvuosimaksunmaara = (state: RootState) =>
  state.hakutulos.lukuvuosimaksunmaara;
const getApuraha = (state: RootState) => state.hakutulos.apuraha;
const getHakualkaaPaivissa = (state: RootState) => state.hakutulos.hakualkaapaivissa;

const getHakutulos = (state: RootState) => state.hakutulos;

export const getRajainValues = createSelector(getHakutulos, (hakutulos) =>
  pick(hakutulos, RAJAIN_TYPES_ARR)
);

export const getSelectedTab = (state: RootState) => state.hakutulos.selectedTab;

export const getSize = (state: RootState) => state.hakutulos.size;

export const getKoulutusPage = (state: RootState) =>
  getPaginationPage({
    offset: state.hakutulos.koulutusOffset,
    size: state.hakutulos.size,
  });

export const getOppilaitosPage = (state: RootState) =>
  getPaginationPage({
    offset: state.hakutulos.oppilaitosOffset,
    size: state.hakutulos.size,
  });

export const getOrder = (state: RootState) => state.hakutulos.order;

export const getSort = (state: RootState) => state.hakutulos.sort;

export const getSortOrder = (state: RootState) =>
  state.hakutulos.sort + '_' + state.hakutulos.order;

export const getIsAnyFilterSelected = createSelector(
  [
    getOpetuskieli,
    getOpetusaika,
    getKoulutustyyppi,
    getKoulutusala,
    getKunta,
    getMaakunta,
    getOpetustapa,
    getValintatapa,
    getHakukaynnissa,
    getHakutapa,
    getYhteishaku,
    getPohjakoulutusvaatimus,
    getJotpa,
    getTyovoimakoulutus,
    getTaydennyskoulutus,
    getKoulutuksenKestoKuukausina,
    getAlkamiskausi,
    getMaksullisuustyyppi,
    getMaksunmaara,
    getLukuvuosimaksunmaara,
    getApuraha,
    getHakualkaaPaivissa,
  ],
  (
    opetuskieli,
    opetusaika,
    koulutustyyppi,
    koulutusala,
    kunta,
    maakunta,
    opetustapa,
    valintatapa,
    hakukaynnissa,
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus,
    jotpa,
    tyovoimakoulutus,
    taydennyskoulutus,
    koulutuksenkestokuukausina,
    alkamiskausi,
    maksullisuustyyppi,
    maksunmaara,
    lukuvuosimaksunmaara,
    apuraha,
    hakualkaapaivissa
  ) => {
    return (
      hakukaynnissa ||
      jotpa ||
      tyovoimakoulutus ||
      taydennyskoulutus ||
      apuraha ||
      some(
        [
          opetusaika,
          opetuskieli,
          koulutustyyppi,
          koulutusala,
          kunta,
          maakunta,
          opetustapa,
          valintatapa,
          hakutapa,
          yhteishaku,
          pohjakoulutusvaatimus,
          alkamiskausi,
          maksullisuustyyppi,
          hakualkaapaivissa,
        ],
        (filterArr) => _size(filterArr) > 0
      ) ||
      some([koulutuksenkestokuukausina, maksunmaara, lukuvuosimaksunmaara], (obj) =>
        some(Object.values(obj), (val) => val > 0)
      )
    );
  }
);

export const getRajainParams = createSelector(
  [
    getOpetusaika,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getKunta,
    getMaakunta,
    getOpetustapa,
    getValintatapa,
    getHakukaynnissa,
    getHakutapa,
    getYhteishaku,
    getPohjakoulutusvaatimus,
    getJotpa,
    getTyovoimakoulutus,
    getTaydennyskoulutus,
    getKoulutuksenKestoKuukausina,
    getAlkamiskausi,
    getMaksullisuustyyppi,
    getMaksunmaara,
    getLukuvuosimaksunmaara,
    getApuraha,
    getHakualkaaPaivissa,
  ],
  (
    opetusaika,
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    kunta,
    maakunta,
    opetustapa,
    valintatapa,
    hakukaynnissa,
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus,
    jotpa,
    tyovoimakoulutus,
    taydennyskoulutus,
    koulutuksenkestokuukausina,
    alkamiskausi,
    maksullisuustyyppi,
    maksunmaara,
    lukuvuosimaksunmaara,
    apuraha,
    hakualkaapaivissa
  ) => ({
    opetusaika,
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    sijainti: concat(kunta, maakunta),
    opetustapa,
    valintatapa,
    hakutapa,
    hakukaynnissa,
    jotpa,
    tyovoimakoulutus,
    taydennyskoulutus,
    ...koulutuksenkestokuukausina,
    ...maksunmaara,
    ...lukuvuosimaksunmaara,
    apuraha,
    yhteishaku,
    pohjakoulutusvaatimus,
    alkamiskausi,
    maksullisuustyyppi,
    hakualkaapaivissa,
  })
);

export const getSearchRequestParams = createSelector(
  [getKeyword, getOrder, getSort, getSize, getRajainParams],
  (keyword, order, sort, size, rajainParams) => ({
    keyword,
    order,
    sort,
    size,
    ...rajainParams,
    hakualkaapaivissa: safeParseNumber(rajainParams.hakualkaapaivissa?.[0]),
  })
);

export const getHakuParams = createSelector(
  [getSearchRequestParams],
  (apiRequestParams) => {
    const minMaxParams = keys(apiRequestParams).filter(
      (param) =>
        (param.endsWith('_min') || param.endsWith('_max')) &&
        includes(RAJAIN_TYPES_ARR, param.split('_')[0])
    );
    const hakuParams = cleanRequestParams(
      pick(apiRequestParams, [
        'order',
        'sort',
        'size',
        'tab',
        ...RAJAIN_TYPES_ARR,
        ...minMaxParams,
      ])
    );

    const hakuParamsStr = qs.stringify(hakuParams, { arrayFormat: 'comma' });
    return { hakuParams, hakuParamsStr };
  }
);

export const getHakuUrl = createSelector(
  [getKeyword, getHakuParams],
  (keyword, { hakuParamsStr }) => `/haku${keyword ? '/' + keyword : ''}?${hakuParamsStr}`
);

export const createHakuUrl = (
  keyword: string,
  hakuParams: Record<string, any>,
  lng: string
) =>
  `/${lng}/haku${keyword ? '/' + keyword : ''}?${qs.stringify(hakuParams, {
    arrayFormat: 'comma',
  })}`;

export const TOTEUTUS_RAJAIN_NAMES = [
  'koulutustyyppi',
  'opetusaika',
  'opetuskieli',
  'maakunta',
  'kunta',
  'opetustapa',
  'hakukaynnissa',
  'jotpa',
  'tyovoimakoulutus',
  'taydennyskoulutus',
  'hakutapa',
  'yhteishaku',
  'pohjakoulutusvaatimus',
  'valintatapa',
  'lukiopainotukset',
  'lukiolinjaterityinenkoulutustehtava',
  'osaamisala',
  'koulutuksenkestokuukausina',
  'alkamiskausi',
  'maksullisuus',
  'maksullisuustyyppi',
  'maksunmaara',
  'lukuvuosimaksunmaara',
  'hakualkaapaivissa',
];

export const getInitialToteutusRajainValues = createSelector(
  [getRajainValues],
  (checkedValues) => pick(checkedValues, TOTEUTUS_RAJAIN_NAMES)
);
