import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import _fp from 'lodash/fp';

import { getKoulutusJarjestajat } from '#/src/api/konfoApi';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  jarjestajatStatus: IDLE_STATUS,
  tulevatJarjestajatStatus: IDLE_STATUS,
  jarjestajat: [],
  jarjestajatFilters: {},
  tulevatJarjestajat: {},
  jarjestajatError: null,
};

const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    fetchJarjestajatStart(state) {
      if (state.jarjestajatStatus === IDLE_STATUS) {
        state.jarjestajatStatus = LOADING_STATUS;
      }
    },
    fetchTulevatJarjestajatStart(state) {
      if (state.tulevatJarjestajatStatus === IDLE_STATUS) {
        state.tulevatJarjestajatStatus = LOADING_STATUS;
      }
    },
    fetchJarjestajatSuccess(state, { payload }) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        const { jarjestajatData } = payload;
        state.jarjestajat = jarjestajatData.hits;
        state.jarjestajatFilters = jarjestajatData.filters;
        state.error = null;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchJarjestajatError(state, action) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        state.jarjestajatError = action.payload;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchTulevatJarjestajatSuccess(state, { payload }) {
      if (state.tulevatJarjestajatStatus === LOADING_STATUS) {
        const { tulevatJarjestajat, oid } = payload;
        state.tulevatJarjestajat[oid] = tulevatJarjestajat;
        state.error = null;
        state.tulevatJarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchTulevatJarjestajatError(state, action) {
      if (state.tulevatJarjestajatStatus === LOADING_STATUS) {
        state.tulevatJarjestajatError = action.payload;
        state.tulevatJarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchSuositellutKoulutuksetError(state, action) {
      if (state.suositellutKoulutuksetStatus === LOADING_STATUS) {
        state.suositellutKoulutuksetError = action.payload;
        state.suositellutKoulutuksetStatus = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchJarjestajatStart,
  fetchTulevatJarjestajatStart,
  fetchJarjestajatSuccess,
  fetchTulevatJarjestajatSuccess,
  fetchSuositellutKoulutuksetError,
  fetchJarjestajatError,
  fetchTulevatJarjestajatError,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const fetchKoulutusJarjestajat = (oid, requestParams) => async (dispatch) => {
  try {
    dispatch(fetchJarjestajatStart());

    // TODO: This does not use paging but backend presumes so? Does this only show first 20 toteutukses?
    const jarjestajatData = await getKoulutusJarjestajat(oid, {
      ...requestParams,
      size: 100,
    });
    dispatch(fetchJarjestajatSuccess({ jarjestajatData }));
  } catch (err) {
    dispatch(fetchJarjestajatError(err.toString()));
  }
};

export const fetchTulevatJarjestajat = (oid) => async (dispatch) => {
  try {
    dispatch(fetchTulevatJarjestajatStart());

    // TODO: This does not use paging but backend presumes so? Does this only show first 20 toteutukses?
    const tulevatJarjestajat = await getKoulutusJarjestajat(oid, {
      tuleva: true,
      size: 100,
    });
    dispatch(
      fetchTulevatJarjestajatSuccess({
        oid,
        tulevatJarjestajat,
      })
    );
  } catch (err) {
    dispatch(fetchTulevatJarjestajatError(err.toString()));
  }
};

export const selectLoading = (state) =>
  state.koulutus.tulevatJarjestajatStatus === LOADING_STATUS;

export const selectTulevatJarjestajat = (state, oid) =>
  state.koulutus.tulevatJarjestajat[oid]?.hits;

export const selectJarjestajat = (state) => {
  // Ei näytetä järjestäjälistassa sellaisia suodattimia joiden lukumäärä on 0 (niitä on paljon)
  const sortedFilters = _.mapValues(
    state.koulutus.jarjestajatFilters || {},
    _fp.pickBy((v) => !_fp.isObject(v) || v.count > 0)
  );

  return {
    jarjestajat: state.koulutus.jarjestajat,
    loading: state.koulutus.jarjestajatStatus === LOADING_STATUS,
    sortedFilters,
  };
};
