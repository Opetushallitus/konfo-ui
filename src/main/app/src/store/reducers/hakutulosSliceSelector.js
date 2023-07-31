import { createSelector } from '@reduxjs/toolkit';
import { pick, some, size as _size, sortBy, concat, keys, includes } from 'lodash';
import qs from 'query-string';

import { FILTER_TYPES_ARR } from '#/src/constants';
import { cleanRequestParams, getPaginationPage } from '#/src/tools/utils';

// State data getters
export const getKeyword = (state) => state.hakutulos.keyword;

export const getKoulutusOffset = (state) => state.hakutulos.koulutusOffset;

export const getOppilaitosOffset = (state) => state.hakutulos.oppilaitosOffset;

const getOpetuskieli = (state) => state.hakutulos.opetuskieli;

const getOpetusaika = (state) => state.hakutulos.opetusaika;

const getKoulutustyyppi = (state) => state.hakutulos.koulutustyyppi;

const getKoulutustyyppiMuu = (state) => state.hakutulos['koulutustyyppi-muu'];

const getKoulutusala = (state) => state.hakutulos.koulutusala;

const getKunta = (state) => state.hakutulos.kunta;

const getMaakunta = (state) => state.hakutulos.maakunta;

const getOpetustapa = (state) => state.hakutulos.opetustapa;

const getKoulutuksenKestoKuukausina = (state) =>
  state.hakutulos.koulutuksenkestokuukausina;

const getValintatapa = (state) => state.hakutulos.valintatapa;
const getHakukaynnissa = (state) => state.hakutulos.hakukaynnissa;
const getHakutapa = (state) => state.hakutulos.hakutapa;
const getYhteishaku = (state) => state.hakutulos.yhteishaku;
const getPohjakoulutusvaatimus = (state) => state.hakutulos.pohjakoulutusvaatimus;

const getJotpa = (state) => state.hakutulos.jotpa;
const getTyovoimakoulutus = (state) => state.hakutulos.tyovoimakoulutus;
const getTaydennyskoulutus = (state) => state.hakutulos.taydennyskoulutus;

const getAlkamiskausi = (state) => state.hakutulos.alkamiskausi;

const getMaksullisuustyyppi = (state) => state.hakutulos.maksullisuustyyppi;
const getMaksunmaara = (state) => state.hakutulos.maksunmaara;
const getLukuvuosimaksunmaara = (state) => state.hakutulos.lukuvuosimaksunmaara;
const getApuraha = (state) => state.hakutulos.apuraha;

const getHakutulos = (state) => state.hakutulos;

export const getFilters = createSelector(getHakutulos, (hakutulos) =>
  pick(hakutulos, FILTER_TYPES_ARR)
);

export const getSelectedTab = (state) => state.hakutulos.selectedTab;

export const getSize = (state) => state.hakutulos.size;

export const getKoulutusPage = (state) =>
  getPaginationPage({
    offset: state.hakutulos.koulutusOffset,
    size: state.hakutulos.size,
  });

export const getOppilaitosPage = (state) =>
  getPaginationPage({
    offset: state.hakutulos.oppilaitosOffset,
    size: state.hakutulos.size,
  });

export const getOrder = (state) => state.hakutulos.order;

export const getSort = (state) => state.hakutulos.sort;

export const getSortOrder = (state) => state.hakutulos.sort + '_' + state.hakutulos.order;

//Selectors
export const getIsAnyFilterSelected = createSelector(
  [
    getOpetuskieli,
    getOpetusaika,
    getKoulutustyyppi,
    getKoulutustyyppiMuu,
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
  ],
  (
    opetuskieli,
    opetusaika,
    koulutustyyppi,
    koulutustyyppiMuu,
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
    apuraha
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
          koulutustyyppiMuu,
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
        ],
        (filterArr) => _size(filterArr) > 0
      ) ||
      some([koulutuksenkestokuukausina, maksunmaara, lukuvuosimaksunmaara], (obj) =>
        some(Object.values(obj), (val) => val > 0)
      )
    );
  }
);

const getCheckedFiltersIdsStr = (checkedfiltersArr) =>
  checkedfiltersArr ? sortBy(checkedfiltersArr)?.join(',') ?? '' : '';

export const getAPIRequestParams = createSelector(
  [
    getKeyword,
    getOrder,
    getSort,
    getSize,
    getOpetuskieli,
    getOpetusaika,
    getKoulutustyyppi,
    getKoulutustyyppiMuu,
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
  ],
  (
    keyword,
    order,
    sort,
    size,
    opetuskieli,
    opetusaika,
    koulutustyyppi,
    koulutustyyppiMuu,
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
    apuraha
  ) => ({
    keyword,
    order,
    sort,
    size,
    opetuskieli: getCheckedFiltersIdsStr(opetuskieli),
    koulutustyyppi: getCheckedFiltersIdsStr(concat(koulutustyyppi, koulutustyyppiMuu)),
    opetusaika: getCheckedFiltersIdsStr(opetusaika),
    koulutusala: getCheckedFiltersIdsStr(koulutusala),
    sijainti: getCheckedFiltersIdsStr(concat(kunta, maakunta)),
    opetustapa: getCheckedFiltersIdsStr(opetustapa),
    valintatapa: getCheckedFiltersIdsStr(valintatapa),
    hakutapa: getCheckedFiltersIdsStr(hakutapa),
    hakukaynnissa,
    jotpa,
    tyovoimakoulutus,
    taydennyskoulutus,
    ...koulutuksenkestokuukausina,
    ...maksunmaara,
    ...lukuvuosimaksunmaara,
    apuraha,
    yhteishaku: getCheckedFiltersIdsStr(yhteishaku),
    pohjakoulutusvaatimus: getCheckedFiltersIdsStr(pohjakoulutusvaatimus),
    alkamiskausi: getCheckedFiltersIdsStr(alkamiskausi),
    maksullisuustyyppi: getCheckedFiltersIdsStr(maksullisuustyyppi),
  })
);

export const getAutocompleteRequestParams = createSelector(
  [
    getOpetusaika,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutustyyppiMuu,
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
  ],
  (
    opetusaika,
    opetuskieli,
    koulutustyyppi,
    koulutustyyppiMuu,
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
    apuraha
  ) => ({
    opetusaika: getCheckedFiltersIdsStr(opetusaika),
    opetuskieli: getCheckedFiltersIdsStr(opetuskieli),
    koulutustyyppi: getCheckedFiltersIdsStr(concat(koulutustyyppi, koulutustyyppiMuu)),
    koulutusala: getCheckedFiltersIdsStr(koulutusala),
    sijainti: getCheckedFiltersIdsStr(concat(kunta, maakunta)),
    opetustapa: getCheckedFiltersIdsStr(opetustapa),
    valintatapa: getCheckedFiltersIdsStr(valintatapa),
    hakutapa: getCheckedFiltersIdsStr(hakutapa),
    hakukaynnissa,
    jotpa,
    tyovoimakoulutus,
    taydennyskoulutus,
    ...koulutuksenkestokuukausina,
    ...maksunmaara,
    ...lukuvuosimaksunmaara,
    apuraha,
    yhteishaku: getCheckedFiltersIdsStr(yhteishaku),
    pohjakoulutusvaatimus: getCheckedFiltersIdsStr(pohjakoulutusvaatimus),
    alkamiskausi: getCheckedFiltersIdsStr(alkamiskausi),
    maksullisuustyyppi: getCheckedFiltersIdsStr(maksullisuustyyppi),
  })
);

export const getHakuParams = createSelector([getAPIRequestParams], (apiRequestParams) => {
  const minMaxParams = keys(apiRequestParams).filter(
    (param) =>
      (param.endsWith('_min') || param.endsWith('_max')) &&
      includes(FILTER_TYPES_ARR, param.split('_')[0])
  );
  const hakuParams = cleanRequestParams(
    pick(apiRequestParams, [
      'order',
      'sort',
      'size',
      'tab',
      ...FILTER_TYPES_ARR,
      ...minMaxParams,
    ])
  );

  const hakuParamsStr = qs.stringify(hakuParams, { arrayFormat: 'comma' });
  return { hakuParams, hakuParamsStr };
});

export const getHakuUrl = createSelector(
  [getKeyword, getHakuParams],
  (keyword, { hakuParamsStr }) => `/haku${keyword ? '/' + keyword : ''}?${hakuParamsStr}`
);

export const createHakuUrl = (keyword, hakuParams, lng) =>
  `/${lng}/haku${keyword ? '/' + keyword : ''}?${qs.stringify(hakuParams, {
    arrayFormat: 'comma',
  })}`;

export const getInitialCheckedToteutusFilters = createSelector(
  [getFilters],
  (checkedValues) =>
    pick(checkedValues, [
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
      'maksullisuustyyppi',
      'maksunmaara',
      'lukuvuosimaksunmaara',
      'apuraha',
    ])
);
