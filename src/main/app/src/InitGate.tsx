import { PropsWithChildren, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { getConfiguration } from '#/src/api/konfoApi';
import { useQueryOnce } from '#/src/hooks/useQueryOnce';
import { configureI18n } from '#/src/tools/i18n';
import { configureUrls } from '#/src/urls';

import { LoadingCircleUntranslated } from './components/common/LoadingCircle';
import { useLocationChanged } from './store/reducers/appSlice';

const useSyncAppPage = () => {
  const location = useLocation();
  const locationChanged = useLocationChanged();

  useEffect(() => {
    locationChanged(location);
  }, [location, locationChanged]);
};

export const InitGate = ({ children }: PropsWithChildren) => {
  const { status: urlStatus } = useQueryOnce('urls', configureUrls);
  const { status: i18nStatus } = useQueryOnce('i18n', configureI18n);
  const { status: configurationStatus } = useQueryOnce('configuration', getConfiguration);

  useSyncAppPage();

  if ([urlStatus, i18nStatus, configurationStatus].includes('loading')) {
    return <LoadingCircleUntranslated hiddenLabel="Sovellusta ladataan..." />;
  } else if ([urlStatus, i18nStatus, configurationStatus].includes('error')) {
    return <div>Sovelluksen lataaminen epäonnistui!</div>;
  } else {
    return <>{children}</>;
  }
};
