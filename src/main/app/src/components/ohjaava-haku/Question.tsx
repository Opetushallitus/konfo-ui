import React, { useState } from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { KoulutuksenKesto } from '#/src/components/ohjaava-haku/KoulutuksenKesto';
import { Maksullisuus } from '#/src/components/ohjaava-haku/Maksullisuus';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { QuestionWithOptions } from './QuestionWithOptions';
import { classes } from './StyledRoot';
import { useSearch } from '../../components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '../Heading';

export type Question = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
};

export type Rajain = {
  [rajainId: string]:
    | Array<string>
    | { koulutuksenkestokuukausina_min: number; koulutuksenkestokuukausina_max: number }
    | { maksunmaara_min: number; maksunmaara_max: number }
    | { lukuvuosimaksunmaara_min: number; lukuvuosimaksunmaara_max: number };
};

type RajainKey = keyof typeof RAJAIN_TYPES;

export const RajainOption = ({
  id,
  useRajainOptionNameFromRajain,
  isRajainSelected,
  nimi,
  rajainId,
  toggleAllSelectedRajainValues,
}: {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  isRajainSelected?: boolean;
  nimi?: Translateable;
  rajainId: string;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Button
      {...(isRajainSelected && {
        startIcon: <MaterialIcon icon="check" />,
      })}
      key={id}
      onClick={() => toggleAllSelectedRajainValues(id, rajainId)}
      className={classes.question__option}
      {...(isRajainSelected && { 'data-selected': true })}>
      {useRajainOptionNameFromRajain
        ? localize(nimi)
        : t(`ohjaava-haku.kysymykset.${rajainId}.vaihtoehdot.${id}`)}
    </Button>
  );
};

export const QuestionInfoText = ({ questionInfo }: { questionInfo: string }) => (
  <Grid item xs={12} marginBottom="1rem">
    <Typography>{questionInfo}</Typography>
  </Grid>
);

type QuestionProps = {
  question: Question;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  lastQuestionIndex: number;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  allSelectedRajainValues: Rajain;
  setAllSelectedRajainValues: (val: Rajain) => void;
};

export const Question = ({
  question,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  lastQuestionIndex,
  toggleAllSelectedRajainValues,
  allSelectedRajainValues,
  setAllSelectedRajainValues,
}: QuestionProps) => {
  const { t } = useTranslation();

  const { goToSearchPage, setRajainValues, rajainValues, rajainOptions, isFetching } =
    useSearch();
  const { id: questionId } = question;
  const questionTitle = t(`ohjaava-haku.kysymykset.${questionId}.otsikko`);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === lastQuestionIndex;
  const [errorKey, setErrorKey] = useState('');

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES[questionId.toUpperCase() as RajainKey]
  );

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    window.scrollTo(0, 0);
  };

  const moveToPreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    window.scrollTo(0, 0);
  };

  const seeResults = () => {
    setRajainValues(allSelectedRajainValues);
    goToSearchPage();
  };

  return (
    <HeadingBoundary>
      <Grid container item className={classes.questionContainer}>
        <Grid item xs={12}>
          <Heading variant="h2">{questionTitle}</Heading>
        </Grid>
        <Grid container item>
          {isFetching ? (
            <Grid item sx={{ margin: 'auto' }}>
              <LoadingCircle />
            </Grid>
          ) : (
            <Grid item>
              {questionId == 'koulutuksenkestokuukausina' ? (
                <KoulutuksenKesto
                  rajainItems={rajainItems}
                  allSelectedRajainValues={allSelectedRajainValues}
                  setAllSelectedRajainValues={setAllSelectedRajainValues}
                  setErrorKey={setErrorKey}
                  errorKey={errorKey}
                />
              ) : questionId == 'maksullisuus' ? (
                <Maksullisuus
                  rajainItems={rajainItems}
                  allSelectedRajainValues={allSelectedRajainValues}
                  toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
                  setAllSelectedRajainValues={setAllSelectedRajainValues}
                  setErrorKey={setErrorKey}
                  errorKey={errorKey}
                />
              ) : (
                <QuestionWithOptions
                  question={question}
                  rajainItems={rajainItems}
                  allSelectedRajainValues={allSelectedRajainValues}
                  toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
                />
              )}
            </Grid>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          className={
            isLastQuestion
              ? `${classes.buttonContainer} ${classes.buttonContainerLastQuestion}`
              : classes.buttonContainer
          }>
          {!isLastQuestion && (
            <Button
              className={classes.buttonContainer__next}
              onClick={moveToNextQuestion}
              variant="contained"
              color="primary"
              disabled={!isEmpty(errorKey)}>
              {t('ohjaava-haku.seuraava')}
            </Button>
          )}
          {!isFirstQuestion && (
            <Button
              className={classes.buttonContainer__previous}
              onClick={moveToPreviousQuestion}
              variant="outlined"
              color="primary"
              disabled={!isEmpty(errorKey)}>
              {t('ohjaava-haku.edellinen')}
            </Button>
          )}
          {
            <Button
              className={classes.buttonContainer__results}
              onClick={seeResults}
              color="primary"
              variant={isLastQuestion ? 'contained' : 'text'}
              disabled={!isEmpty(errorKey)}>
              {t('ohjaava-haku.katso-tulokset')}
            </Button>
          }
        </Grid>
      </Grid>
    </HeadingBoundary>
  );
};
