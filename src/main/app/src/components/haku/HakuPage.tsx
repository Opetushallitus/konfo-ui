import React, { useEffect } from 'react';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import { searchAllOnPageReload } from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getIsReady,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/useUrlParams';

export const HakuPage = () => {
  const { search, updateUrlSearchParams } = useUrlParams();

  // TODO: keyword should probably be refactored into url params since hakupalkki is found in other pages too
  const { keyword } = useParams<{ keyword: string }>();
  const queryParams = useSelector(getAPIRequestParams, shallowEqual);
  const isReady = useSelector(getIsReady);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(searchAllOnPageReload({ search, keyword }));
  });

  // Update queryparameters when any haku api -request related parameters change
  useEffect(() => {
    if (isReady) {
      updateUrlSearchParams(queryParams);
    }
  }, [isReady, queryParams, updateUrlSearchParams]);

  return <Hakutulos />;
};
