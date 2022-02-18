import { combineReducers } from '@reduxjs/toolkit';

import appSlice from './appSlice';
import hakutulosSlice from './hakutulosSlice';
import koulutusSlice from './koulutusSlice';
import oppilaitosSlice from './oppilaitosSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  oppilaitos: oppilaitosSlice,
  hakutulos: hakutulosSlice,
  app: appSlice,
});
