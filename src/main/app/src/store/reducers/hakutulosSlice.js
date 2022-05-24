import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { searchAPI } from '#/src/api/konfoApi';
import {
  FILTER_TYPES,
  FILTER_TYPES_ARR_FOR_KONFO_BACKEND,
  KOULUTUS_TYYPPI_MUU_ARR,
} from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';
import { cleanRequestParams } from '#/src/tools/utils';

import { getAPIRequestParams } from './hakutulosSliceSelector';

const INITIAL = 'initial';
const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';
const KOULUTUS = 'koulutus';
const OPPILAITOS = 'oppilaitos';

export const initialState = {
  status: INITIAL,
  error: null,
  keyword: '',

  // Koulutukset, sisältää lukumäärät ja käännökset mitä backend vastaa
  koulutusHits: [],
  koulutusFilters: {},
  koulutusTotal: null,
  koulutusOffset: 0,
  koulutusPage: 1,

  // Oppilaitokset, sisältää lukumäärät ja käännökset mitä backend vastaa
  oppilaitosHits: [],
  oppilaitosFilters: {},
  oppilaitosTotal: null,
  oppilaitosOffset: 0,
  oppilaitosPage: 1,

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
      state.keyword = payload.keyword;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload.newSelectedTab;
    },
    setFilterSelectedValues: (state, { payload: newValues = [] }) => {
      _.forEach(newValues, (values, filterId) => (state[filterId] = values));
    },
    clearPaging: (state) => {
      state.koulutusPage = 1;
      state.oppilaitosPage = 1;
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
    },
    setOrder: (state, { payload }) => {
      state.order = payload.newOrder;
    },
    setSort: (state, { payload }) => {
      state.sort = payload.newSort;
    },
    searchAPICallStart(state) {
      if (state.status === INITIAL || state.status === IDLE_STATUS) {
        state.status = LOADING_STATUS;
      }
    },
    searchAllSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const {
          koulutusData,
          oppilaitosData,
          isNewKeyword,
          isReload,
          filters,
          literals,
        } = payload;
        state.koulutusHits = koulutusData.hits;
        state.koulutusFilters = koulutusData.filters;
        state.koulutusTotal = koulutusData.total;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosFilters = oppilaitosData.filters;
        state.oppilaitosTotal = oppilaitosData.total;
        if (
          _.size(koulutusData.hits) === 0 &&
          _.size(oppilaitosData.hits) > 0 &&
          isNewKeyword
        ) {
          state.selectedTab = OPPILAITOS;
        } else if (_.size(koulutusData.hits) > 0 && isNewKeyword) {
          state.selectedTab = KOULUTUS;
        }

        // NOTE: Tämä asettaa ja kääntää initial arvot stateen
        if (isReload) {
          _.forEach(literals, (val, key) => {
            state[key] = val;
          });
          _.forEach(filters, (filterValues, key) => {
            const values = filterValues.split(',');
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

        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchKoulutuksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { koulutusData, offset, page } = payload;
        state.koulutusHits = koulutusData.hits;
        state.koulutusOffset = offset;
        state.koulutusPage = page;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchOppilaitoksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { oppilaitosData, offset, page } = payload;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosOffset = offset;
        state.oppilaitosPage = page;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchAPICallError(state, action) {
      if (state.status === LOADING_STATUS) {
        state.error = action.payload;
        state.status = IDLE_STATUS;
      }
    },
  },
});

export const {
  setKeyword,
  setSelectedTab,
  searchAPICallStart,
  searchAPICallError,
  setFilterSelectedValues,
  clearPaging,
  clearSelectedFilters,
  setOrder,
  setSort,
  setSize,
  searchAllSuccess,
  searchKoulutuksetSuccess,
  searchOppilaitoksetSuccess,
} = hakutulosSlice.actions;

export default hakutulosSlice.reducer;

// TODO: Remove Searchall when all filters use this
export const newSearchAll = () => async (dispatch, getState) => {
  const state = getState();
  const requestParams = getAPIRequestParams(state);
  dispatch(clearPaging());

  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);

    const filters = _.pick(requestParams, FILTER_TYPES_ARR_FOR_KONFO_BACKEND);
    const literals = _.pick(requestParams, ['size', 'order', 'sort']);
    dispatch(
      searchAllSuccess({
        koulutusData,
        oppilaitosData,
        filters,
        literals,
      })
    );
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};

export const searchAll =
  (requestParams, isNewKeyword = false, isReload = false) =>
  async (dispatch) => {
    try {
      dispatch(searchAPICallStart());
      const koulutusData = await searchAPI.getKoulutukset(requestParams);
      const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
      const filters = _.pick(requestParams, FILTER_TYPES_ARR_FOR_KONFO_BACKEND);
      const literals = _.pick(requestParams, ['size', 'order', 'sort']);
      dispatch(
        searchAllSuccess({
          koulutusData,
          oppilaitosData,
          isNewKeyword,
          isReload,
          filters,
          literals,
        })
      );
    } catch (err) {
      dispatch(searchAPICallError(err.toString()));
    }
  };

// TODO: yhdistä tämä osaksi newSearchAll
export const searchKoulutukset =
  ({ requestParams, offset, page }) =>
  async (dispatch) => {
    try {
      dispatch(searchAPICallStart());
      const koulutusData = await searchAPI.getKoulutukset(requestParams);
      dispatch(searchKoulutuksetSuccess({ koulutusData, offset, page }));
    } catch (err) {
      dispatch(searchAPICallError(err.toString()));
    }
  };

// TODO: yhdistä tämä osaksi newSearchAll
export const searchOppilaitokset =
  ({ requestParams, offset, page }) =>
  async (dispatch) => {
    try {
      dispatch(searchAPICallStart());
      const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
      dispatch(searchOppilaitoksetSuccess({ oppilaitosData, offset, page }));
    } catch (err) {
      dispatch(searchAPICallError(err.toString()));
    }
  };

export const searchAllOnPageReload =
  ({ search, keyword }) =>
  (dispatch, getState) => {
    const state = getState();
    const apiRequestParams = getAPIRequestParams(state);
    const cleanedUrlSearch = getCleanUrlSearch(search, apiRequestParams);
    const { hakutulos } = state;

    if (!_.isMatch(apiRequestParams, { ...cleanedUrlSearch, keyword })) {
      dispatch(setKeyword({ keyword }));
      dispatch(
        searchAll(
          cleanRequestParams({ ...apiRequestParams, keyword, ...cleanedUrlSearch }),
          hakutulos.keyword !== keyword,
          true
        )
      );
    }
  };

export const searchAndMoveToHaku =
  ({ history }) =>
  (dispatch, getState) => {
    const { hakutulos } = getState();
    const apiRequestParams = getAPIRequestParams({ hakutulos });
    const lng = getLanguage();
    const restParams = new URLSearchParams(
      _.pick(cleanRequestParams(apiRequestParams), [
        'keyword',
        'order',
        'size',
        ...FILTER_TYPES_ARR_FOR_KONFO_BACKEND,
      ])
    ).toString();
    history.push(`/${lng}/haku/${hakutulos.keyword}?${restParams}`);
    dispatch(searchAll(apiRequestParams, true));
  };

// Helpers
function getCleanUrlSearch(search, apiRequestParams) {
  return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
    _.includes(FILTER_TYPES_ARR_FOR_KONFO_BACKEND, key)
      ? _.join(_.sortBy(_.split(value, ',')), ',')
      : value
  );
}
