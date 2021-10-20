import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialPaging = {
  page: 1,
  size: 5,
  offset: 0,
};

export const initialState = {
  tulevatJarjestajat: {
    filters: {},
    pagination: {
      ...initialPaging,
    },
  },
  jarjestajat: {
    filters: {},
    pagination: {
      ...initialPaging,
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
    resetJarjestajatPaging(state) {
      Object.assign(state.jarjestajat.pagination, initialState.jarjestajat.pagination);
    },
    resetTulevatJarjestajatPaging(state) {
      Object.assign(
        state.tulevatJarjestajat.pagination,
        initialState.tulevatJarjestajat.pagination
      );
    },
  },
});

export const {
  setJarjestajatFilters,
  setJarjestajatPaging,
  resetJarjestajatPaging,
  setTulevatJarjestajatFilters,
  setTulevatJarjestajatPaging,
  resetJarjestajatQuery,
  resetTulevatJarjestajatQuery,
  selectTulevatJarjestajatQuery,
  resetTulevatJarjestajatPaging,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const selectJarjestajatQuery = (isTuleva) => (state) =>
  isTuleva ? state?.koulutus?.tulevatJarjestajat : state?.koulutus?.jarjestajat;
