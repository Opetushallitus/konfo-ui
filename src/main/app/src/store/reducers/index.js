import { combineReducers } from '@reduxjs/toolkit';

import { hakutulosSlice } from './hakutulosSlice';
import { koulutusSlice } from './koulutusSlice';
import { oppilaitosSlice } from './oppilaitosSlice';
import { pistelaskuriSlice } from './pistelaskuriSlice';

export const reducer = combineReducers({
  koulutus: koulutusSlice.reducer,
  oppilaitos: oppilaitosSlice.reducer,
  hakutulos: hakutulosSlice.reducer,
  pistelaskuri: pistelaskuriSlice.reducer,
});
