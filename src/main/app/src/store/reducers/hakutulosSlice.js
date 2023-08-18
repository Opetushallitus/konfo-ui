import { createSlice } from '@reduxjs/toolkit';
import {
  forEach,
  isMatch,
  split,
  mapValues,
  pick,
  omit,
  includes,
  join,
  sortBy,
  groupBy,
  reduce,
} from 'lodash';

import { FILTER_TYPES, FILTER_TYPES_ARR_FOR_KONFO_BACKEND } from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';

import { getAPIRequestParams, getHakuUrl } from './hakutulosSliceSelector';

export const HAKU_INITIAL_FILTERS = {
  koulutustyyppi: [],
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
  koulutuksenkestokuukausina: {
    koulutuksenkestokuukausina_min: 0,
    koulutuksenkestokuukausina_max: 0,
  },
  maksullisuustyyppi: [],
  maksunmaara: {
    maksunmaara_min: 0,
    maksunmaara_max: 0,
  },
  lukuvuosimaksunmaara: {
    lukuvuosimaksunmaara_min: 0,
    lukuvuosimaksunmaara_max: 0,
  },
  apuraha: false,
  alkamiskausi: [],
};

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
  ...HAKU_INITIAL_FILTERS,
};

export const hakutulosSlice = createSlice({
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
      Object.assign(state, HAKU_INITIAL_FILTERS);
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
        const minmaxParamsGrouped = groupMinMaxParams(cleanedParams);
        forEach(omit(cleanedParams, minmaxParams(cleanedParams)), (value, key) => {
          const valueList = split(value, ',');
          switch (key) {
            case 'keyword':
            case 'size':
            case 'order':
            case 'sort':
              state[key] = value;
              break;
            case FILTER_TYPES.SIJAINTI:
              state.maakunta = valueList.filter((v) => v.startsWith('maakunta'));
              state.kunta = valueList.filter((v) => v.startsWith('kunta'));
              break;
            case FILTER_TYPES.HAKUKAYNNISSA:
            case FILTER_TYPES.JOTPA:
            case FILTER_TYPES.TYOVOIMAKOULUTUS:
            case FILTER_TYPES.TAYDENNYSKOULUTUS:
            case FILTER_TYPES.APURAHA:
              setBooleanValueToState(state, key, value);
              break;
            default:
              state[key] = valueList;
              break;
          }
        });
        forEach(minmaxParamsGrouped, (value, key) => {
          state[key] = value;
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

const setBooleanValueToState = (state, key, value) => (state[key] = value === 'true');

const minmaxParams = (allParams) =>
  Object.keys(allParams).filter((k) => k.endsWith('_min') || k.endsWith('_max'));
const groupMinMaxParams = (params) => {
  const groupedParamNames = groupBy(minmaxParams(params), (param) => param.split('_')[0]);
  return mapValues(groupedParamNames, (val) =>
    reduce(
      val,
      (obj, param) => {
        obj[param] = params[param];
        return obj;
      },
      {}
    )
  );
};
