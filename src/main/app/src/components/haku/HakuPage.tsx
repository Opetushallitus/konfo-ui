import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { urlParamsChanged } from '#/src/store/reducers/hakutulosSlice';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/useUrlParams';

const useSyncedHakuParams = () => {
  const { search } = useUrlParams();

  const dispatch = useDispatch();

  // Kun URL:n search-parametrit muuttuu, synkataan muutokset reduxiin
  useEffect(() => {
    dispatch(urlParamsChanged({ search }));
  }, [dispatch, search]);
};

export const HakuPage = () => {
  useSyncedHakuParams();

  return <Hakutulos />;
};
