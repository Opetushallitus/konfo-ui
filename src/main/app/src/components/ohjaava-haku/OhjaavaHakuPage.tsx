import React, { useState } from 'react';

import { Box, Button, Typography } from '@mui/material';
import { has } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import * as configProd from '#/ohjaava-haku.json';
import * as configPlaywright from '#/playwright/ohjaava-haku-test-config.json';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { Question, Rajain } from '#/src/components/ohjaava-haku/Question';
import { getChangedRajaimet } from '#/src/components/ohjaava-haku/utils';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { toId } from '#/src/tools/utils';

import { ProgressSivupalkki } from './ProgressSivupalkki';
import { classes, StyledRoot } from './StyledRoot';

type Config = {
  kysymykset: Array<ConfigItem>;
};

type ConfigItem = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
};

const config: Config =
  import.meta.env.VITE_PLAYWRIGHT === 'true' ? configPlaywright : configProd;

export const OhjaavaHaku = () => {
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const { clearRajainValues, rajainValues } = useSearch();
  const [allSelectedRajainValues, setAllSelectedRajainValues] = useState<Rajain>({});

  const toggleAllRajainValues = (id: string, rajainId: string) => {
    setAllSelectedRajainValues(getChangedRajaimet(allSelectedRajainValues, rajainId, id));
  };

  const [isStartOfKysely, setStartOfKysely] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = config.kysymykset;
  const questionsWithoutInvalidOptions = questions.filter(({ id }) => {
    return has(rajainValues, id);
  });

  const lastQuestionIndex = questionsWithoutInvalidOptions.length - 1;
  const currentQuestion = questionsWithoutInvalidOptions[currentQuestionIndex];

  const startQuestionnaire = () => {
    setStartOfKysely(false);
    clearRajainValues();
  };

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
        {isStartOfKysely ? (
          <Box>
            <HeadingBoundary>
              <Heading
                id={toId(t(ohjaavaHakuTitle))}
                variant="h2"
                sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                {ohjaavaHakuTitle}
              </Heading>
            </HeadingBoundary>
            <Typography sx={{ marginBottom: '1.5rem' }}>
              {t('ohjaava-haku.info-text')}
            </Typography>
            <Button
              onClick={startQuestionnaire}
              variant="contained"
              color="primary"
              sx={{ marginBottom: '30%' }}>
              {t('ohjaava-haku.aloita-kysely')}
            </Button>
          </Box>
        ) : (
          <Box className={classes.container}>
            <ProgressSivupalkki
              questions={questionsWithoutInvalidOptions}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
            <Question
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              lastQuestionIndex={lastQuestionIndex}
              toggleAllSelectedRajainValues={toggleAllRajainValues}
              allSelectedRajainValues={allSelectedRajainValues}
              setAllSelectedRajainValues={setAllSelectedRajainValues}
            />
          </Box>
        )}
      </StyledRoot>
    </ContentWrapper>
  );
};
