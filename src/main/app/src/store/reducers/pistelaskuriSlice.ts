import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootStateOrAny, useSelector } from 'react-redux';

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
  },
});

export const useLaskuriHakukohde = () =>
  useSelector((state: RootStateOrAny) => state.pistelaskuri.hakukohde);

export const { setHakukohde } = pistelaskuriSlice.actions;
