import { configureStore } from '@reduxjs/toolkit';

import { reducer } from './reducers';
import { isDev } from '../tools/utils';

export const store = configureStore({
  reducer,
  devTools: isDev,
});

if (isDev && import.meta.hot) {
  import.meta.hot.accept('./reducers', () => store.replaceReducer(reducer));
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
