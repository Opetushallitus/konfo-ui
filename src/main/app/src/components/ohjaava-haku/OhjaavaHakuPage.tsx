import React, { useState } from 'react';

import { Box } from '@mui/material';
import { has } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import configProd from '#/ohjaava-haku.json';
import configPlaywright from '#/playwright/ohjaava-haku-test-config.json';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { OhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
import { Question, Rajain } from '#/src/components/ohjaava-haku/Question';
import { getChangedRajaimet } from '#/src/components/ohjaava-haku/utils';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { isPlaywright } from '#/src/tools/utils';

import { ProgressSivupalkki } from './ProgressSivupalkki';
import { StartComponent } from './StartComponent';
import { classes, StyledRoot } from './StyledRoot';

type Config = {
  kysymykset: Array<ConfigItem>;
};

type ConfigItem = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
};

const config: Config = isPlaywright ? configPlaywright : configProd;

export const OhjaavaHaku = () => {
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const { rajainValues } = useSearch();
  const [allSelectedRajainValues, setAllSelectedRajainValues] = useState<Rajain>({});

  const toggleAllSelectedRajainValues = (id: string, rajainId: string) => {
    setAllSelectedRajainValues(getChangedRajaimet(allSelectedRajainValues, rajainId, id));
  };

  const [isStartOfQuestionnaire, setStartOfQuestionnaire] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = config.kysymykset;
  const questionsWithoutInvalidOptions = questions.filter(({ id }) => {
    return has(rajainValues, id);
  });

  const lastQuestionIndex = questionsWithoutInvalidOptions.length - 1;
  const currentQuestion = questionsWithoutInvalidOptions[currentQuestionIndex];

  const ohjaavaHakuTitle = t('ohjaava-haku.otsikko');

  const value = {
    toggleAllSelectedRajainValues,
    allSelectedRajainValues,
    setAllSelectedRajainValues,
    questions: questionsWithoutInvalidOptions,
    question: currentQuestion,
    currentQuestion,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    lastQuestionIndex,
  };

  return (
    <OhjaavaHakuContext.Provider value={value}>
      <ContentWrapper>
        <StyledRoot>
          <Box>
            <Murupolku
              path={[
                { name: t('haku.otsikko'), link: hakuUrl },
                { name: ohjaavaHakuTitle },
              ]}
            />
          </Box>
          {isStartOfQuestionnaire ? (
            <StartComponent
              ohjaavaHakuTitle={ohjaavaHakuTitle}
              setStartOfQuestionnaire={setStartOfQuestionnaire}
            />
          ) : (
            <Box className={classes.container}>
              <ProgressSivupalkki />
              <Question />
            </Box>
          )}
        </StyledRoot>
      </ContentWrapper>
    </OhjaavaHakuContext.Provider>
  );
};
