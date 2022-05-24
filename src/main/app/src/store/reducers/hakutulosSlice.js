import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  FILTER_TYPES,
  FILTER_TYPES_ARR_FOR_KONFO_BACKEND,
  KOULUTUS_TYYPPI_MUU_ARR,
} from '#/src/constants';

import { getAPIRequestParams, getHakuUrl } from './hakutulosSliceSelector';

const KOULUTUS = 'koulutus';

export const initialState = {
  // Koulutukset, sisältää lukumäärät ja käännökset mitä backend vastaa
  koulutusOffset: 0,

  // Oppilaitokset, sisältää lukumäärät ja käännökset mitä backend vastaa
  oppilaitosOffset: 0,

  keyword: '',
  // Persistoidut suodatinvalinnat, listoja valituista koodiarvoista (+ yksi boolean rajain)
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
  size: 20,
  selectedTab: KOULUTUS,
  order: 'desc',
  sort: 'score',
};

const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      // TODO: Kun keyword asetetaan, myös URL pitäisi asettaa
      state.keyword = payload.keyword;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload.newSelectedTab;
    },
    setFilterSelectedValues: (state, { payload: newValues = [] }) => {
      // TODO: Kun filttereitä muutetaan, täytyy myös URL asettaa
      // 1. Muunnetaan redux-filtterit URL:ksi
      // 2. Jos reduxista muodostettu URL muuttui, asetetaan myös se
      _.forEach(newValues, (values, filterId) => (state[filterId] = values));
    },
    clearPaging: (state) => {
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
    },
    setSize: (state, { payload }) => {
      state.size = payload.newSize;
      state.koulutusOffset = 0;
      state.oppilaitosOffset = 0;
    },
    setKoulutusOffset: (state, { payload }) => {
      state.koulutusOffset = payload.offset;
    },
    setOppilaitosOffset: (state, { payload }) => {
      state.oppilaitosOffset = payload.offset;
    },
    setOrder: (state, { payload }) => {
      state.order = payload.newOrder;
    },
    setSort: (state, { payload }) => {
      state.sort = payload.newSort;
    },
    setSortOrder: (state, { payload }) => {
      const [sort, order] = payload.split('_');
      state.sort = sort;
      state.order = order;
    },
    urlParamsChanged(state, { payload }) {
      const { search } = payload;
      const apiRequestParams = getAPIRequestParams({ hakutulos: state });
      const cleanedUrlSearch = getCleanUrlSearch(search, apiRequestParams);

      if (!_.isMatch(apiRequestParams, cleanedUrlSearch)) {
        const requestParams = { ...apiRequestParams, ...cleanedUrlSearch };
        const filters = _.pick(requestParams, FILTER_TYPES_ARR_FOR_KONFO_BACKEND);
        const literals = _.pick(requestParams, ['size', 'order', 'sort']);
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
  clearPaging,
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
  (dispatch, getState) => {
    const state = getState();
    const { url } = getHakuUrl(state);
    history.push(url);
  };

// Helpers
function getCleanUrlSearch(search, apiRequestParams) {
  return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
    _.includes(FILTER_TYPES_ARR_FOR_KONFO_BACKEND, key)
      ? _.join(_.sortBy(_.split(value, ',')), ',')
      : value
  );
}
