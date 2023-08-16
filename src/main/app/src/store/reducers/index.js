import { combineReducers } from '@reduxjs/toolkit';

import { appSlice } from './appSlice';
import { hakutulosSlice } from './hakutulosSlice';
import { koulutusSlice } from './koulutusSlice';
import { oppilaitosSlice } from './oppilaitosSlice';
import { pistelaskuriSlice } from './pistelaskuriSlice';

export const reducer = combineReducers({
  koulutus: koulutusSlice.reducer,
  oppilaitos: oppilaitosSlice.reducer,
  hakutulos: hakutulosSlice.reducer,
  app: appSlice.reducer,
  pistelaskuri: pistelaskuriSlice.reducer,
});
