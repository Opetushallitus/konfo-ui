import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    currentPage: {},
    previousPage: {},
  },
  reducers: {
    setMenuState: (state, action) => {
      state.sideMenuOpen = action.payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.previousPage = state.currentPage;
      state.currentPage = payload.currentPage;
    },
  },
});

export const usePreviousPage = () => {
  return useSelector((state) => state.app.previousPage);
};

export const { setMenuState, setCurrentPage } = appSlice.actions;

export default appSlice.reducer;
