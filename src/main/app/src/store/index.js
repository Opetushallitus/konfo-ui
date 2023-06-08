import { configureStore } from '@reduxjs/toolkit';

import { isDev } from '../tools/utils';
import reducer from './reducers';

export function getKonfoStore() {
  const store = configureStore({
    reducer,
    devTools: isDev,
  });

  if (isDev && import.meta.hot) {
    import.meta.hot.accept('./reducers', () => store.replaceReducer(reducer));
  }
  return store;
}
