import { create } from 'zustand';

import { Rajain } from '#/src/components/ohjaava-haku/Question';
import { getChangedRajaimet } from '#/src/components/ohjaava-haku/utils';

type OhjaavaHakuState = {
  currentQuestionIndex: number;
  isStartOfQuestionnaire: boolean;
  allSelectedRajainValues: Rajain;
};

type OhjaavaHakuActions = {
  setIsStartOfQuestionnaire: (val: boolean) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAllSelectedRajainValues: (val: Rajain) => void;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  reset: () => void;
};

const initialState: OhjaavaHakuState = {
  currentQuestionIndex: 0,
  isStartOfQuestionnaire: true,
  allSelectedRajainValues: {},
};

export const useOhjaavaHaku = create<OhjaavaHakuState & OhjaavaHakuActions>()((set) => ({
  ...initialState,
  setIsStartOfQuestionnaire: (val) => set(() => ({ isStartOfQuestionnaire: val })),
  setCurrentQuestionIndex: (index) => set(() => ({ currentQuestionIndex: index })),
  setAllSelectedRajainValues: (val: Rajain) => {
    set((state) => {
      return {
        ...state,
        allSelectedRajainValues: val,
      };
    });
  },
  toggleAllSelectedRajainValues: (id, rajainId) =>
    set((state) => {
      return {
        ...state,
        allSelectedRajainValues: getChangedRajaimet(
          state.allSelectedRajainValues,
          rajainId,
          id
        ),
      };
    }),
  reset: () => {
    set(initialState);
  },
}));
