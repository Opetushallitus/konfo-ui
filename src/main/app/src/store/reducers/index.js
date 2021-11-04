import { combineReducers } from '@reduxjs/toolkit';

import hakutulosSlice from './hakutulosSlice';
import koulutusSlice from './koulutusSlice';
import oppilaitosSlice from './oppilaitosSlice';
import sidemenuSlice from './sideMenuSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  oppilaitos: oppilaitosSlice,
  hakutulos: hakutulosSlice,
  sideMenu: sidemenuSlice,
});
