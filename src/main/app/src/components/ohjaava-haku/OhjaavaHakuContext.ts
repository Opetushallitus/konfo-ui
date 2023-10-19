import { createContext, useContext } from 'react';

import { useStore, createStore } from 'zustand';

import { QuestionType } from '#/src/components/ohjaava-haku/Question';

interface QuestionsProps {
  questions: Array<QuestionType>;
  lastQuestionIndex: number;
}

interface QuestionsState extends QuestionsProps {}

export const createQuestionsStore = (initProps: QuestionsProps) => {
  const DEFAULT_PROPS: QuestionsProps = {
    questions: [],
    lastQuestionIndex: 0,
  };

  return createStore<QuestionsState>()(() => ({
    ...DEFAULT_PROPS,
    ...initProps,
  }));
};

type QuestionsStore = ReturnType<typeof createQuestionsStore>;

export const QuestionsContext = createContext<QuestionsStore | undefined>(undefined);

export const useQuestionsStore = <T>(selector: (state: QuestionsProps) => T): T => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error(
      `useOhjaavaHakuContext must be used within OhjaavaHakuContextProvider`
    );
  }

  return useStore(context, selector);
};
