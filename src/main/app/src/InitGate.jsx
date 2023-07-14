import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import { getConfiguration } from '#/src/api/konfoApi';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useQueryOnce } from '#/src/hooks/useQueryOnce';
import { configureI18n } from '#/src/tools/i18n';
import { configureUrls } from '#/src/urls';

import { locationChanged } from './store/reducers/appSlice';

const useSyncAppPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(locationChanged(location));
  }, [dispatch, location]);
};

export const InitGate = ({ children }) => {
  const { status: urlStatus } = useQueryOnce('urls', configureUrls);
  const { status: i18nStatus } = useQueryOnce('i18n', configureI18n);
  const { status: configurationStatus } = useQueryOnce('configuration', getConfiguration);

  useSyncAppPage();

  if ([urlStatus, i18nStatus, configurationStatus].includes('loading')) {
    return <LoadingCircle />;
  } else if ([urlStatus, i18nStatus, configurationStatus].includes('error')) {
    return <div>Sovelluksen lataaminen epäonnistui!</div>;
  } else {
    return children;
  }
};
