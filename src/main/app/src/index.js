import React, { Suspense, useEffect } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, useLocation } from 'react-router-dom';
import 'typeface-open-sans';
import StackTrace from 'stacktrace-js';

import { getConfiguration, postClientError } from '#/src/api/konfoApi';
import App from '#/src/App';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useQueryOnce } from '#/src/hooks/useQueryOnce';
import ScrollToTop from '#/src/ScrollToTop';
import { getKonfoStore } from '#/src/store';
import { locationChanged } from '#/src/store/reducers/appSlice';
import { theme } from '#/src/theme';
import { configureI18n } from '#/src/tools/i18n';
import { isCypress } from '#/src/tools/utils';
import { configureUrls } from '#/src/urls';

import GenericError from './GenericError';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5000,
      retry: 1,
    },
  },
});

if ('serviceWorker' in navigator) {
  if (window.Cypress) {
    console.log('Not registering service worker');
  } else {
    console.log('Registering service worker');
    navigator.serviceWorker
      .register('/konfo/service-worker-custom.js', { scope: '/konfo/' })
      .then(
        function (registration) {
          console.log('Service worker registration succeeded:', registration);
        },
        /*catch*/ function (error) {
          console.log('Service worker registration failed:', error);
        }
      );
  }
}

const uninterestingErrors = {
  'ResizeObserver loop limit exceeded0': true,
  'Script Error.0': true,
};

window.onerror = (errorMsg, _url, line, col, errorObj) => {
  if (process.env.NODE_ENV === 'production' && !isCypress) {
    const errorKey = errorMsg + line;
    const send = (trace) => {
      if (!uninterestingErrors[errorKey]) {
        postClientError({
          'error-message': errorMsg,
          url: window.location.href,
          line: line,
          col: col,
          'user-agent': window.navigator.userAgent,
          stack: trace ? trace : 'No stacktrace available',
        });
        uninterestingErrors[errorKey] = true;
      }
    };
    StackTrace.fromError(errorObj)
      .then((err) => {
        console.log(err);
        send(JSON.stringify(err));
      })
      .catch(() => {
        send(JSON.stringify(errorObj));
      });
  }
};

const useSyncAppPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(locationChanged(location));
  }, [dispatch, location]);
};

const InitGate = ({ children }) => {
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

ReactDOM.render(
  <ErrorBoundary FallbackComponent={GenericError}>
    <Suspense fallback={<LoadingCircle />}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={getKonfoStore()}>
          <BrowserRouter basename="/konfo">
            <ThemeProvider theme={theme}>
              <InitGate>
                <ScrollToTop />
                <App />
              </InitGate>
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  </ErrorBoundary>,
  document.getElementById('wrapper')
);
