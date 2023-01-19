import { useMemo } from 'react';

import { createSlice } from '@reduxjs/toolkit';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { getKoodistonKoodit } from '#/src/api/konfoApi';
import { translate } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

export const useKieliKoodit = () => {
  const { data } = useQuery<Array<Koodi>>(
    ['getKoodistonKoodit'],
    () => getKoodistonKoodit('kielivalikoima'),
    { staleTime: Infinity }
  );
  return useMemo(() => {
    return data?.sort((a: Koodi, b: Koodi) => {
      const aName = translate(a.nimi).toLowerCase();
      const bName = translate(b.nimi).toLowerCase();
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });
  }, [data]);
};

export const pistelaskuriSlice = createSlice({
  name: 'pistelaskuri',
  initialState: {
    hakukohde: undefined,
  },
  reducers: {
    setHakukohde: (state, action) => {
      state.hakukohde = action.payload;
    },
  },
});

export const useLaskuriHakukohde = () =>
  useSelector((state) => (state as any).pistelaskuri.hakukohde);

export const { setHakukohde } = pistelaskuriSlice.actions;
