import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    currentLocation: {},
    previousLocation: {},
  },
  reducers: {
    setMenuState: (state, action) => {
      state.sideMenuOpen = action.payload;
    },
    setCurrentLocation: (state, { payload }) => {
      state.previousLocation = state.currentLocation;
      state.currentLocation = payload.currentLocation;
    },
  },
});

export const usePreviousLocation = () => {
  return useSelector((state) => state.app.previousLocation);
};

export const usePreviousPage = () => {
  return _.split(usePreviousLocation().pathname, '/')?.[2];
};

export const useMenuOpen = () => {
  return useSelector((state) => state.app.sideMenuOpen);
};

export const { setMenuState, setCurrentLocation } = appSlice.actions;

export default appSlice.reducer;
