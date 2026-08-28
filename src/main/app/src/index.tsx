import React, { Suspense } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'typeface-open-sans';
import StackTrace from 'stacktrace-js';

import { postClientError } from '#/src/api/konfoApi';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { router } from '#/src/router';
import { store } from '#/src/store';
import { theme } from '#/src/theme';
import { isPlaywright, isProd } from '#/src/tools/utils';

import { GenericError } from './GenericError';

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
  if (isPlaywright) {
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

const uninterestingErrors: Record<string, boolean> = {
  'ResizeObserver loop limit exceeded0': true,
  'Script Error.0': true,
};

window.onerror = (errorMsg, _url, line, col, errorObj) => {
  if (isProd && !isPlaywright) {
    const errorKey = `${errorMsg}${line}`;
    const send = (trace?: string) => {
      if (!uninterestingErrors[errorKey]) {
        postClientError({
          'error-message': errorMsg.toString(),
          url: window.location.href,
          line: line,
          col: col,
          'user-agent': window.navigator.userAgent,
          stack: trace ? trace : 'No stacktrace available',
        });
        uninterestingErrors[errorKey] = true;
      }
    };
    if (errorObj) {
      StackTrace.fromError(errorObj)
        .then((err) => {
          console.error(err);
          send(JSON.stringify(err));
        })
        .catch(() => {
          send(JSON.stringify(errorObj));
        });
    } else {
      send();
    }
  }
};

// getElementById() ei palauta tässä null, koska tiedetään #wrapper-elementin olevan olemassa.
const root = createRoot(document.getElementById('wrapper') as Element);

root.render(
  <ErrorBoundary FallbackComponent={GenericError}>
    <Suspense fallback={<LoadingCircle />}>
      <QueryClientProvider client={queryClient}>
        {!isPlaywright && <ReactQueryDevtools initialIsOpen={false} />}
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  </ErrorBoundary>
);
