import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { Pistelaskuri } from '#/src/components/laskuri/Pistelaskuri';
import {
  unsetHakukohde,
  useLaskuriHakukohde,
} from '#/src/store/reducers/pistelaskuriSlice';

import { HakupisteLaskelma } from './Keskiarvo';

export const EmbeddedPistelaskuri = () => {
  const [tulos, setTulos] = useState<HakupisteLaskelma | null>(null);
  const dispatch = useDispatch();
  const hakukohde = useLaskuriHakukohde();

  useEffect(() => {
    if (hakukohde) {
      dispatch(unsetHakukohde());
    }
  }, [hakukohde, dispatch]);

  return <Pistelaskuri updateTulos={setTulos} embedded={true} tulos={tulos} />;
};
