import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  size: 5,
  offset: 0,
  tulevaSize: 3,
  tulevaOffset: 0,
  order: 'asc',
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
  },
});

export const { setTarjontaPagination, setTulevaTarjontaPagination, resetPagination } =
  oppilaitosSlice.actions;
