import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { getPaginationPage } from '#/src/tools/utils';

const initialPagination = {
  size: 5,
  offset: 0,
};

export const initialState = {
  tulevatJarjestajat: {
    filters: {},
    pagination: {
      ...initialPagination,
    },
  },
  jarjestajat: {
    filters: {},
    pagination: {
      ...initialPagination,
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

const withPage = (pagination) => ({
  ...pagination,
  page: getPaginationPage({
    offset: pagination.offset,
    size: pagination.size,
  }),
});

export const selectJarjestajatQuery = (isTuleva) => (state) => {
  const jarjestajat = isTuleva
    ? state?.koulutus?.tulevatJarjestajat
    : state?.koulutus?.jarjestajat;
  return {
    ...jarjestajat,
    pagination: withPage(jarjestajat.pagination),
  };
};
