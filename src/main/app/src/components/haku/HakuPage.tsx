import React, { useEffect } from 'react';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import { urlParamsChanged } from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getHakuUrl,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/useUrlParams';

const useSyncedHakuParams = () => {
  const { search, updateUrlSearchParams } = useUrlParams();

  const dispatch = useDispatch();

  // Kun URL muuttuu, muutetaan filtterit yms. reduxiin
  // Eikö pitäisi synkata aina, eikä vain kerran?
  useEffectOnce(() => {
    // Lähetetään muuttunut URL reduxille
    dispatch(urlParamsChanged({ search }));
  });

  const queryParams = useSelector(getAPIRequestParams, shallowEqual);
  const { url: hakuUrl } = useSelector(getHakuUrl);

  const location = useLocation();

  const url = '/haku' + location.search;

  // Kun redux muuttuu, päivitetään url
  useEffect(() => {
    if (url !== hakuUrl) {
      updateUrlSearchParams(queryParams);
    }
  }, [url, hakuUrl, queryParams, updateUrlSearchParams]);
};

export const HakuPage = () => {
  useSyncedHakuParams();

  return <Hakutulos />;
};
