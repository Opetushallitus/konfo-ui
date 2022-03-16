import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducers';

export function getKonfoStore() {
  const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducer));
  }
  return store;
}
