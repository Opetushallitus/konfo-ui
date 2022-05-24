import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { urlParamsChanged } from '#/src/store/reducers/hakutulosSlice';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/useUrlParams';

const useSyncedHakuParams = () => {
  const { search } = useUrlParams();
  const { keyword } = useParams<any>();

  const dispatch = useDispatch();

  // Kun URL:n search-parametrit muuttuu, synkataan muutokset reduxiin
  useEffect(() => {
    dispatch(urlParamsChanged({ keyword, search }));
  }, [dispatch, search, keyword]);
};

export const HakuPage = () => {
  useSyncedHakuParams();

  return <Hakutulos />;
};
