import React, { Suspense, useEffect } from 'react';

import { ThemeProvider } from '@material-ui/core';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, useHistory } from 'react-router-dom';
import 'typeface-open-sans';
import StackTrace from 'stacktrace-js';

import { postClientError } from '#/src/api/konfoApi';
import App from '#/src/App';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useQueryOnce } from '#/src/hooks';
import ScrollToTop from '#/src/ScrollToTop';
import { getKonfoStore } from '#/src/store';
import { setCurrentLocation } from '#/src/store/reducers/appSlice';
import { theme } from '#/src/theme';
import { configureI18n } from '#/src/tools/i18n';
import { isCypress } from '#/src/tools/utils';
import { configureUrls } from '#/src/urls';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5000,
    },
  },
});

if ('serviceWorker' in navigator) {
  if (!window.Cypress) {
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
  } else {
    console.log('Not registering service worker');
  }
}

window.onerror = (errorMsg, url, line, col, errorObj) => {
  if (process.env.NODE_ENV === 'production' && !isCypress) {
    const send = (trace) => {
      postClientError({
        'error-message': errorMsg,
        url: window.location.href,
        line: line,
        col: col,
        'user-agent': window.navigator.userAgent,
        stack: trace,
      });
    };
    StackTrace.fromError(errorObj)
      .then((err) => {
        console.log(err);
        send(JSON.stringify(err));
      })
      .catch((err) => {
        send(JSON.stringify(errorObj));
      });
  }
};

const InitGate = ({ children }) => {
  const { status: urlStatus } = useQueryOnce('urls', configureUrls);
  const { status: i18nStatus } = useQueryOnce('i18n', configureI18n);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    return history.listen((currentLocation) => {
      dispatch(setCurrentLocation({ currentLocation }));
    });
  }, [dispatch, history]);

  if ([urlStatus, i18nStatus].includes('loading')) {
    return <LoadingCircle />;
  } else if ([urlStatus, i18nStatus].includes('error')) {
    return <div>Sovelluksen lataaminen epäonnistui!</div>;
  } else {
    return children;
  }
};

ReactDOM.render(
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
  </Suspense>,
  document.getElementById('wrapper')
);
