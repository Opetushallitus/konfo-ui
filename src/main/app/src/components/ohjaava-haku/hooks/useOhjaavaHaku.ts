import { createContext, useContext } from 'react';

import { createStore, useStore } from 'zustand';

import { QuestionType, Rajain } from '#/src/components/ohjaava-haku/Question';
import { getChangedRajaimet } from '#/src/components/ohjaava-haku/utils';

type OhjaavaHakuData = {
  currentQuestionIndex: number;
  isStartOfQuestionnaire: boolean;
  allSelectedRajainValues: Rajain;
  questions: Array<QuestionType>;
  lastQuestionIndex: number;
};

type OhjaavaHakuOperations = {
  setIsStartOfQuestionnaire: (val: boolean) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAllSelectedRajainValues: (val: Rajain) => void;
  toggleAllSelectedRajainValues: (
    rajainId: string,
    rajainValueIds?: Array<string>
  ) => void;
};

const initialState: OhjaavaHakuData = {
  questions: [],
  lastQuestionIndex: 0,
  currentQuestionIndex: 0,
  isStartOfQuestionnaire: true,
  allSelectedRajainValues: {},
};

type OhjaavaHakuState = OhjaavaHakuData & OhjaavaHakuOperations;

export const createOhjaavaHakuStore = (initProps: Partial<OhjaavaHakuData>) => {
  return createStore<OhjaavaHakuState>()((set) => ({
    ...initialState,
    ...initProps,
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
    toggleAllSelectedRajainValues: (rajainId, rajainValueIds) =>
      set((state) => {
        return {
          ...state,
          allSelectedRajainValues: getChangedRajaimet(
            state.allSelectedRajainValues,
            rajainId,
            rajainValueIds
          ),
        };
      }),
  }));
};

export type OhjaavaHakuStore = ReturnType<typeof createOhjaavaHakuStore>;

export const OhjaavaHakuContext = createContext<OhjaavaHakuStore | undefined>(undefined);

export const useOhjaavaHaku = <T>(selector: (state: OhjaavaHakuState) => T): T => {
  const context = useContext(OhjaavaHakuContext);
  if (!context) {
    throw new Error(`useOhjaavaHaku must be used within OhjaavaHakuContext`);
  }
  return useStore(context, selector);
};
