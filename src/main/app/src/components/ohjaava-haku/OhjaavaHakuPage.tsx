import React, { useRef } from 'react';

import { Box } from '@mui/material';
import { has } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import configProd from '#/ohjaava-haku.json';
import configPlaywright from '#/playwright/ohjaava-haku-test-config.json';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { Question } from '#/src/components/ohjaava-haku/Question';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { styled } from '#/src/theme';
import { isPlaywright } from '#/src/tools/utils';

import {
  createOhjaavaHakuStore,
  OhjaavaHakuContext,
  OhjaavaHakuStore,
  useOhjaavaHaku,
} from './hooks/useOhjaavaHaku';
import { Progress } from './Progress';
import { StartComponent } from './StartComponent';

type Config = {
  kysymykset: Array<ConfigItem>;
};

type ConfigItem = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
};

const config: Config = isPlaywright ? configPlaywright : configProd;

const StyledRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const QuestionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const OhjaavaHaku = () => {
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);
  const isStartOfQuestionnaire = useOhjaavaHaku((s) => s.isStartOfQuestionnaire);
  const ohjaavaHakuTitle = t('ohjaava-haku.otsikko');

  return (
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
          <StartComponent ohjaavaHakuTitle={ohjaavaHakuTitle} />
        ) : (
          <QuestionContainer>
            <Progress />
            <Question />
          </QuestionContainer>
        )}
      </StyledRoot>
    </ContentWrapper>
  );
};

export const OhjaavaHakuPage = () => {
  const { rajainValues } = useSearch();

  const questions = config.kysymykset;

  const questionsWithoutInvalidOptions = questions.filter(({ id }) =>
    has(rajainValues, id)
  );

  const lastQuestionIndex = questionsWithoutInvalidOptions.length - 1;

  const storeRef = useRef<OhjaavaHakuStore>();

  if (!storeRef.current) {
    storeRef.current = createOhjaavaHakuStore({
      questions: questionsWithoutInvalidOptions,
      lastQuestionIndex,
    });
  }

  return (
    <OhjaavaHakuContext.Provider value={storeRef.current}>
      <OhjaavaHaku />
    </OhjaavaHakuContext.Provider>
  );
};
