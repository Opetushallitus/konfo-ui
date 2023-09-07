import { createSelector, createSlice } from '@reduxjs/toolkit';
import { merge, pick } from 'lodash';

import { RootState } from '#/src/store';
import { getPaginationPage } from '#/src/tools/utils';

import { HAKU_RAJAIMET_INITIAL } from './hakutulosSlice';
import { TOTEUTUS_RAJAIN_NAMES } from './hakutulosSliceSelector';

const initialPagination = {
  size: 5,
  offset: 0,
};

export const initialState = {
  tulevatJarjestajat: {
    rajainValues: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_RAJAIN_NAMES),
    pagination: {
      ...initialPagination,
    },
  },
  jarjestajat: {
    rajainValues: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_RAJAIN_NAMES),
    pagination: {
      ...initialPagination,
    },
  },
};

export const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    setJarjestajatRajainValues(state, action) {
      if (action.payload) {
        Object.assign(state.jarjestajat.rajainValues, action.payload);
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
    setTulevatJarjestajatRajainValues(state, action) {
      if (action.payload) {
        Object.assign(state.tulevatJarjestajat.rajainValues, action.payload);
      }
    },
    clearJarjestajatRajainValues(state) {
      Object.assign(state.jarjestajat, initialState.jarjestajat);
    },
    clearTulevatJarjestajatRajainValues(state) {
      Object.assign(state.tulevatJarjestajat, initialState.tulevatJarjestajat);
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
  setJarjestajatRajainValues,
  setJarjestajatPaging,
  resetJarjestajatPaging,
  setTulevatJarjestajatRajainValues,
  setTulevatJarjestajatPaging,
  resetTulevatJarjestajatPaging,
  clearJarjestajatRajainValues,
  clearTulevatJarjestajatRajainValues,
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
