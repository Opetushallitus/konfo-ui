import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const initialState = {
  tulevatJarjestajat: {
    filters: {},
    pagination: {
      page: 1,
      size: 5,
      offset: 0,
    },
  },
  jarjestajat: {
    filters: {},
    pagination: {
      page: 1,
      size: 5,
      offset: 0,
    },
  },
};

const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    setJarjestajatFilters(state, action) {
      if (action.payload) {
        Object.assign(state.jarjestajat.filters, action.payload);
      }
    },
    setJarjestajatPaging(state, action) {
      if (action.payload) {
        _.merge(state.jarjestajat.pagination, action.payload);
      }
    },
    setTulevatJarjestajatPaging(state, action) {
      if (action.payload) {
        _.merge(state.tulevatJarjestajat.pagination, action.payload);
      }
    },
    setTulevatJarjestajatFilters(state, action) {
      if (action.payload) {
        Object.assign(state.tulevatJarjestajat.filters, action.payload);
      }
    },
    resetJarjestajatQuery(state) {
      Object.assign(state.jarjestajat, initialState.jarjestajat);
    },
    resetTulevatJarjestajatQuery(state) {
      Object.assign(state.tulevatJarjestajat, initialState.tulevatJarjestajat);
    },
  },
});

export const {
  setJarjestajatFilters,
  setJarjestajatPaging,
  setTulevatJarjestajatFilters,
  setTulevatJarjestajatPaging,
  resetJarjestajatQuery,
  resetTulevatJarjestajatQuery,
  selectTulevatJarjestajatQuery,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const selectJarjestajatQuery = (isTuleva) => (state) =>
  isTuleva ? state?.koulutus?.tulevatJarjestajat : state?.koulutus?.jarjestajat;
