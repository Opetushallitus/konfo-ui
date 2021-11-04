import { createSlice } from '@reduxjs/toolkit';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

export const sidemenuSlice = createSlice({
  name: 'sidemenu',
  initialState: {
    open: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
  },
  reducers: {
    setMenuState: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setMenuState } = sidemenuSlice.actions;

export default sidemenuSlice.reducer;
