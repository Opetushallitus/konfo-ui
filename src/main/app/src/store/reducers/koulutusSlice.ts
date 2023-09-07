import { createSelector, createSlice } from '@reduxjs/toolkit';
import { merge, pick } from 'lodash';

import { RootState } from '#/src/store';
import { getPaginationPage } from '#/src/tools/utils';

import { HAKU_RAJAIMET_INITIAL } from './hakutulosSlice';
import { TOTEUTUS_FILTER_NAMES } from './hakutulosSliceSelector';

const initialPagination = {
  size: 5,
  offset: 0,
};

export const initialState = {
  tulevatJarjestajat: {
    filters: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_FILTER_NAMES),
    pagination: {
      ...initialPagination,
    },
  },
  jarjestajat: {
    filters: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_FILTER_NAMES),
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
  resetTulevatJarjestajatPaging,
} = koulutusSlice.actions;

const selectKoulutusJarjestajat = (state: RootState) => state?.koulutus?.jarjestajat;
const selectKoulutusTulevatJarjestajat = (state: RootState) =>
  state?.koulutus?.tulevatJarjestajat;

export const selectJarjestajatQuery = createSelector(
  [
    selectKoulutusJarjestajat,
    selectKoulutusTulevatJarjestajat,
    (_state: RootState, isTuleva: boolean) => isTuleva,
  ],
  (jarjestajat, tulevatJarjestajat, isTuleva) => {
    const selectedJarjestajat = isTuleva ? tulevatJarjestajat : jarjestajat;
    const { pagination } = selectedJarjestajat;
    return {
      ...selectedJarjestajat,
      pagination: {
        ...pagination,
        page: getPaginationPage({
          offset: pagination.offset,
          size: pagination.size,
        }),
      },
    };
  }
);
