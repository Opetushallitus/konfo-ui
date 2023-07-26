import { createSlice } from '@reduxjs/toolkit';
import { merge } from 'lodash';

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

export const koulutusSlice = createSlice({
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
        merge(state.jarjestajat.pagination, action.payload);
      }
    },
    setTulevatJarjestajatPaging(state, action) {
      if (action.payload) {
        merge(state.tulevatJarjestajat.pagination, action.payload);
      }
    },
    setTulevatJarjestajatFilters(state, action) {
      if (action.payload) {
        Object.assign(state.tulevatJarjestajat.filters, action.payload);
      }
    },
    resetJarjestajatPaging(state) {
      state.jarjestajat.pagination.offset = 0;
    },
    resetTulevatJarjestajatPaging(state) {
      state.tulevatJarjestajat.pagination.offset = 0;
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
