import { createSlice } from '@reduxjs/toolkit';
import {
  forEach,
  isMatch,
  split,
  without,
  intersection,
  mapValues,
  pick,
  includes,
  join,
  sortBy,
} from 'lodash';

import {
  FILTER_TYPES,
  FILTER_TYPES_ARR_FOR_KONFO_BACKEND,
  KOULUTUS_TYYPPI_MUU_ARR,
} from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';

import { getAPIRequestParams, getHakuUrl } from './hakutulosSliceSelector';

export const initialState = {
  selectedTab: 'koulutus',
  size: 20,
  order: 'desc',
  sort: 'score',

  // offset = ensimmäisen näytettävän entiteetin järjestysnumero
  // Sivunumero päätellään offsetin ja size:n perusteella
  koulutusOffset: 0,
  oppilaitosOffset: 0,

  // Persistoidut suodatinvalinnat, listoja valituista koodiarvoista (+ kaksi boolean rajainta)
  keyword: '',
  koulutustyyppi: [],
  'koulutustyyppi-muu': [],
  koulutusala: [],
  opetuskieli: [],
  valintatapa: [],
  hakukaynnissa: false,
  jotpa: false,
  tyovoimakoulutus: false,
  taydennyskoulutus: false,
  hakutapa: [],
  yhteishaku: [], // NOTE: tämä suodatin ei käytä koodistoarvoja vaan hakuOideja
  kunta: [],
  maakunta: [],
  opetustapa: [],
  pohjakoulutusvaatimus: [],
  lukiopainotukset: [],
  lukiolinjaterityinenkoulutustehtava: [],
  osaamisala: [],
  opetusaika: [],
  koulutuksenkestokuukausina: [],
};

const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload.keyword;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload.newSelectedTab;
    },
    setFilterSelectedValues: (state, { payload: newValues = [] }) => {
      forEach(newValues, (values, filterId) => (state[filterId] = values));
      resetPagination(state);
    },
    resetPagination: (state) => {
      state.koulutusOffset = 0;
      state.oppilaitosOffset = 0;
    },
    clearSelectedFilters: (state) => {
      state.koulutustyyppi = [];
      state['koulutustyyppi-muu'] = [];
      state.koulutusala = [];
      state.opetuskieli = [];
      state.valintatapa = [];
      state.hakukaynnissa = false;
      state.jotpa = false;
      state.tyovoimakoulutus = false;
      state.taydennyskoulutus = false;
      state.hakutapa = [];
      state.yhteishaku = [];
      state.kunta = [];
      state.maakunta = [];
      state.opetustapa = [];
      state.pohjakoulutusvaatimus = [];
      state.lukiopainotukset = [];
      state.lukiolinjaterityinenkoulutustehtava = [];
      state.osaamisala = [];
      state.opetusaika = [];
      state.koulutuksenkestokuukausina = [];

      resetPagination(state);
    },
    setSize: (state, { payload }) => {
      state.size = payload.newSize;
      // Asetetaan sivutus alkuun, koska sivuja voi olla vähemmän kuin aiemmin
      resetPagination(state);
    },
    setKoulutusOffset: (state, { payload }) => {
      state.koulutusOffset = payload.offset;
    },
    setOppilaitosOffset: (state, { payload }) => {
      state.oppilaitosOffset = payload.offset;
    },
    setOrder: (state, { payload }) => {
      state.order = payload;
    },
    setSort: (state, { payload }) => {
      state.sort = payload;
    },
    setSortOrder: (state, { payload }) => {
      const [sort, order] = payload.split('_');
      state.sort = sort;
      state.order = order;
    },
    urlParamsChanged(state, { payload }) {
      const { keyword, search } = payload;
      const params = { keyword, ...search };
      const apiRequestParams = getAPIRequestParams({ hakutulos: state });
      const cleanedParams = getCleanUrlSearch(params, apiRequestParams);

      state.selectedTab = params?.tab ?? 'koulutus';

      if (!isMatch(apiRequestParams, cleanedParams)) {
        forEach(cleanedParams, (value, key) => {
          const valueList = split(value, ',');
          switch (key) {
            case 'keyword':
            case 'size':
            case 'order':
            case 'sort':
              state[key] = value;
              break;
            // TODO: Olisi parempi jos backend lähettäisi ja vastaanottaisi nämä yhtenäisesti,
            // Nyt on lähtiessä koulutustyyppi vs. paluupostina tulee koulutustyyppi JA koulutustyyppi-muu
            case FILTER_TYPES.KOULUTUSTYYPPI:
              state.koulutustyyppi = without(valueList, ...KOULUTUS_TYYPPI_MUU_ARR);
              state['koulutustyyppi-muu'] = intersection(
                valueList,
                KOULUTUS_TYYPPI_MUU_ARR
              );
              break;
            case FILTER_TYPES.SIJAINTI:
              state.maakunta = valueList.filter((v) => v.startsWith('maakunta'));
              state.kunta = valueList.filter((v) => v.startsWith('kunta'));
              break;
            case FILTER_TYPES.HAKUKAYNNISSA:
              state.hakukaynnissa = value === 'true';
              break;
            case FILTER_TYPES.JOTPA:
              state.jotpa = value === 'true';
              break;
            case FILTER_TYPES.TYOVOIMAKOULUTUS:
              state.tyovoimakoulutus = value === 'true';
              break;
            case FILTER_TYPES.TAYDENNYSKOULUTUS:
              state.taydennyskoulutus = value === 'true';
              break;
            default:
              state[key] = valueList;
              break;
          }
        });
      }
    },
  },
});

export const {
  setKeyword,
  setSelectedTab,
  setFilterSelectedValues,
  resetPagination,
  clearSelectedFilters,
  setOrder,
  setSort,
  setSortOrder,
  setSize,
  setKoulutusOffset,
  setOppilaitosOffset,
  urlParamsChanged,
} = hakutulosSlice.actions;

export default hakutulosSlice.reducer;

export const navigateToHaku =
  ({ navigate }) =>
  (_dispatch, getState) => {
    const state = getState();
    const url = getHakuUrl(state);
    navigate('/' + getLanguage() + url);
  };

const getCleanUrlSearch = (search, apiRequestParams) =>
  mapValues(pick(search, Object.keys(apiRequestParams ?? {})), (value, key) =>
    includes(FILTER_TYPES_ARR_FOR_KONFO_BACKEND, key)
      ? join(sortBy(split(value, ',')), ',')
      : value
  );
