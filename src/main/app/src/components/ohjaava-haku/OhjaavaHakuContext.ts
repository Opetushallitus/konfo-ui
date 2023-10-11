import { createContext, useContext } from 'react';

import { QuestionType, Rajain } from '#/src/components/ohjaava-haku/Question';

export type OhjaavaHakuContextType = {
  questions: Array<QuestionType>;
  question: QuestionType;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  lastQuestionIndex: number;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  allSelectedRajainValues: Rajain;
  setAllSelectedRajainValues: (val: Rajain) => void;
};

export const OhjaavaHakuContext = createContext<OhjaavaHakuContextType | undefined>(
  undefined
);

export const useOhjaavaHakuContext = () => {
  const context = useContext(OhjaavaHakuContext);
  if (!context) {
    throw new Error(
      `useOhjaavaHakuContext must be used within OhjaavaHakuContextProvider`
    );
  }

  return context;
};
