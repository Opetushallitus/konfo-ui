import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  FILTER_TYPES,
  FILTER_TYPES_ARR_FOR_KONFO_BACKEND,
  KOULUTUS_TYYPPI_MUU_ARR,
} from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';

import { getAPIRequestParams, getHakuUrl } from './hakutulosSliceSelector';

const KOULUTUS = 'koulutus';

export const initialState = {
  selectedTab: KOULUTUS,
  size: 20,
  order: 'desc',
  sort: 'score',

  // offset = ensimmäisen näytettävän entiteetin järjestysnumero
  // Sivunumero päätellään offsetin ja size:n perusteella
  koulutusOffset: 0,
  oppilaitosOffset: 0,

  // Persistoidut suodatinvalinnat, listoja valituista koodiarvoista (+ yksi boolean rajain)
  keyword: '',
  koulutustyyppi: [],
  'koulutustyyppi-muu': [],
  koulutusala: [],
  opetuskieli: [],
  valintatapa: [],
  hakukaynnissa: false,
  hakutapa: [],
  yhteishaku: [], // NOTE: tämä suodatin ei käytä koodistoarvoja vaan hakuOideja
  kunta: [],
  maakunta: [],
  opetustapa: [],
  pohjakoulutusvaatimus: [],
  lukiopainotukset: [],
  lukiolinjaterityinenkoulutustehtava: [],
  osaamisala: [],
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
      _.forEach(newValues, (values, filterId) => (state[filterId] = values));
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
      state.hakutapa = [];
      state.yhteishaku = [];
      state.kunta = [];
      state.maakunta = [];
      state.opetustapa = [];
      state.pohjakoulutusvaatimus = [];
      state.lukiopainotukset = [];
      state.lukiolinjaterityinenkoulutustehtava = [];
      state.osaamisala = [];

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

      if (!_.isMatch(apiRequestParams, cleanedParams)) {
        const requestParams = { ...apiRequestParams, ...cleanedParams };
        const filters = _.pick(requestParams, FILTER_TYPES_ARR_FOR_KONFO_BACKEND);
        const literals = _.pick(requestParams, ['size', 'order', 'sort']);

        state.keyword = keyword;
        _.forEach(literals, (val, key) => {
          state[key] = val;
        });
        _.forEach(filters, (filterValues, key) => {
          const values = _.split(filterValues, ',');
          switch (key) {
            // TODO: Olisi parempi jos backend lähettäisi ja vastaanottaisi nämä yhtenäisesti,
            // Nyt on lähtiessä koulutustyyppi vs. paluupostina tulee koulutustyyppi JA koulutustyyppi-muu
            case FILTER_TYPES.KOULUTUSTYYPPI:
              state.koulutustyyppi = _.without(values, ...KOULUTUS_TYYPPI_MUU_ARR);
              state['koulutustyyppi-muu'] = _.intersection(
                values,
                KOULUTUS_TYYPPI_MUU_ARR
              );
              break;
            case FILTER_TYPES.SIJAINTI:
              state.maakunta = values.filter((v) => v.startsWith('maakunta'));
              state.kunta = values.filter((v) => v.startsWith('kunta'));
              break;
            case FILTER_TYPES.HAKUKAYNNISSA:
              state.hakukaynnissa = filterValues === 'true';
              break;
            default:
              state[key] = values;
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
  ({ history }) =>
  (_dispatch, getState) => {
    const state = getState();
    const url = getHakuUrl(state);
    history.push('/' + getLanguage() + url);
  };

function getCleanUrlSearch(search, apiRequestParams) {
  return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
    _.includes(FILTER_TYPES_ARR_FOR_KONFO_BACKEND, key)
      ? _.join(_.sortBy(_.split(value, ',')), ',')
      : value
  );
}
