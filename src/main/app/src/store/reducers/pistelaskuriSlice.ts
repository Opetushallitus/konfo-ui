import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { ReduxTodo } from '#/src/types/common';
import { Hakukohde } from '#/src/types/HakukohdeTypes';

type LaskuriSliceState = {
  hakukohde: Hakukohde | undefined;
};

const initialState: LaskuriSliceState = { hakukohde: undefined };

export const pistelaskuriSlice = createSlice({
  name: 'pistelaskuri',
  initialState,
  reducers: {
    setHakukohde: (state, action: PayloadAction<Hakukohde>) => {
      state.hakukohde = action.payload;
    },
    unsetHakukohde: (state) => {
      state.hakukohde = undefined;
    },
  },
});

export const useLaskuriHakukohde = () =>
  useSelector((state: ReduxTodo) => state.pistelaskuri.hakukohde);

export const { setHakukohde, unsetHakukohde } = pistelaskuriSlice.actions;
