import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  page: 1,
  size: 5,
  offset: 0,
  tulevaPage: 1,
  tulevaSize: 3,
  tulevaOffset: 0,
  order: 'asc',
};

const oppilaitosSlice = createSlice({
  name: 'oppilaitos',
  initialState,
  reducers: {
    setTarjontaPagination(state, action) {
      const { page, size, offset, order } = action.payload;
      state.page = page;
      state.size = size;
      state.offset = offset;
      state.order = order;
    },
    setTulevaTarjontaPagination(state, action) {
      const { page, size, offset, order } = action.payload;
      state.tulevaPage = page;
      state.tulevaSize = size;
      state.tulevaOffset = offset;
      state.order = order;
    },
    resetPagination(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setTarjontaPagination, setTulevaTarjontaPagination, resetPagination } =
  oppilaitosSlice.actions;

export default oppilaitosSlice.reducer;
