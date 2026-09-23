import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { isEqual, pick } from 'lodash';

import { HAKU_RAJAIMET_INITIAL, RajainValues } from './hakutulosSlice';
import { TOTEUTUS_RAJAIN_NAMES } from './hakutulosSliceSelector';

export const initialState = {
  size: 5,
  offset: 0,
  tulevaSize: 3,
  tulevaOffset: 0,
  order: 'asc',
  rajainValues: pick(
    HAKU_RAJAIMET_INITIAL,
    TOTEUTUS_RAJAIN_NAMES
  ) as Partial<RajainValues>,
};

export const oppilaitosSlice = createSlice({
  name: 'oppilaitos',
  initialState,
  reducers: {
    setTarjontaPagination(state, action) {
      const { size, offset, order } = action.payload;
      state.size = size;
      state.offset = offset;
      state.order = order;
    },
    setTulevaTarjontaPagination(state, action) {
      const { size, offset, order } = action.payload;
      state.tulevaSize = size;
      state.tulevaOffset = offset;
      state.order = order;
    },
    resetPagination(state) {
      state.offset = 0;
      state.tulevaOffset = 0;
    },
    setTarjontaRajainValues(state, { payload }: PayloadAction<Partial<RajainValues>>) {
      const newRajainValues = Object.assign({}, state.rajainValues, payload);
      // Resetoidaan sivutus, jos rajaimet muuttuu
      if (!isEqual(state.rajainValues, newRajainValues)) {
        state.offset = 0;
      }
      state.rajainValues = newRajainValues;
    },
    clearTarjontaRajainValues(state) {
      state.rajainValues = initialState.rajainValues;
      state.offset = 0;
    },
  },
});

export const {
  setTarjontaPagination,
  setTulevaTarjontaPagination,
  resetPagination,
  setTarjontaRajainValues,
  clearTarjontaRajainValues,
} = oppilaitosSlice.actions;
