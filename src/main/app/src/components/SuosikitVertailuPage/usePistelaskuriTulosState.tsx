import { isEqual } from 'lodash';
import { create } from 'zustand';

import { HakupisteLaskelma } from '../laskuri/Keskiarvo';
import { LocalStorageUtil, RESULT_STORE_KEY } from '../laskuri/LocalStorageUtil';

export interface PistelaskuriVertailuState {
  tulos: HakupisteLaskelma | null;
  setTulos: (hpl: HakupisteLaskelma | null) => void;
}

export const usePistelaskuriTulosState = create<PistelaskuriVertailuState>((set) => ({
  tulos: LocalStorageUtil.load(RESULT_STORE_KEY) as HakupisteLaskelma | null,
  setTulos: (hpl) =>
    set((state) => {
      if (isEqual(state.tulos, hpl)) {
        return state;
      } else {
        return {
          ...state,
          tulos: hpl,
        };
      }
    }),
}));
