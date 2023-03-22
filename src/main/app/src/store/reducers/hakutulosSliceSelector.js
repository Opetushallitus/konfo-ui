import { createSelector } from '@reduxjs/toolkit';
import { pick, some, size as _size, sortBy, concat } from 'lodash';
import qs from 'query-string';

import { FILTER_TYPES_ARR } from '#/src/constants';
import { cleanRequestParams, getPaginationPage } from '#/src/tools/utils';

// State data getters
export const getKeyword = (state) => state.hakutulos.keyword;

export const getKoulutusOffset = (state) => state.hakutulos.koulutusOffset;

export const getOppilaitosOffset = (state) => state.hakutulos.oppilaitosOffset;

const getOpetuskieli = (state) => state.hakutulos.opetuskieli;

const getKoulutustyyppi = (state) => state.hakutulos.koulutustyyppi;

const getKoulutustyyppiMuu = (state) => state.hakutulos['koulutustyyppi-muu'];

const getKoulutusala = (state) => state.hakutulos.koulutusala;

const getKunta = (state) => state.hakutulos.kunta;

const getMaakunta = (state) => state.hakutulos.maakunta;

const getOpetustapa = (state) => state.hakutulos.opetustapa;

const getValintatapa = (state) => state.hakutulos.valintatapa;
const getHakukaynnissa = (state) => state.hakutulos.hakukaynnissa;
const getHakutapa = (state) => state.hakutulos.hakutapa;
const getYhteishaku = (state) => state.hakutulos.yhteishaku;
const getPohjakoulutusvaatimus = (state) => state.hakutulos.pohjakoulutusvaatimus;
const getJotpa = (state) => state.hakutulos.jotpa;

const getTyovoimakoulutus = (state) => state.hakutulos.tyovoimakoulutus;

const getTaydennyskoulutus = (state) => state.hakutulos.taydennyskoulutus;

export const getFilters = (state) => pick(state.hakutulos, FILTER_TYPES_ARR);

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
  ],
  (
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
    taydennyskoulutus
  ) => {
    return (
      hakukaynnissa ||
      jotpa ||
      tyovoimakoulutus ||
      taydennyskoulutus ||
      some(
        [
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
        ],
        (filterArr) => _size(filterArr) > 0
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
  ],
  (
    keyword,
    order,
    sort,
    size,
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
    taydennyskoulutus
  ) => ({
    keyword,
    order,
    sort,
    size,
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
    yhteishaku: getCheckedFiltersIdsStr(yhteishaku),
    pohjakoulutusvaatimus: getCheckedFiltersIdsStr(pohjakoulutusvaatimus),
  })
);

export const getHakuParams = createSelector([getAPIRequestParams], (apiRequestParams) => {
  const hakuParams = cleanRequestParams(
    pick(apiRequestParams, ['order', 'sort', 'size', ...FILTER_TYPES_ARR])
  );

  const hakuParamsStr = qs.stringify(hakuParams, { arrayFormat: 'comma' });
  return { hakuParams, hakuParamsStr };
});

export const getHakuUrl = createSelector(
  [getKeyword, getHakuParams],
  (keyword, { hakuParamsStr }) => {
    return `/haku${keyword ? '/' + keyword : ''}?${hakuParamsStr}`;
  }
);

export const getInitialCheckedToteutusFilters = createSelector(
  [getFilters],
  (checkedValues) =>
    pick(checkedValues, [
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
    ])
);
