import React from 'react';

import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useOhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';

import { QuestionType } from './Question';
import { classes } from './StyledRoot';

export const ProgressSivupalkki = () => {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } =
    useOhjaavaHakuContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const progress = `${t('ohjaava-haku.question')} ${
    currentQuestionIndex + 1
  } / ${questions?.length}`;

  return (
    <>
      {isMobile ? (
        <Grid item sx={{ marginBottom: '1rem' }}>
          {progress}
        </Grid>
      ) : (
        <Grid container item direction="column" className={classes.progressSivupalkki}>
          {questions.map((question: QuestionType, index: number) => {
            const questionId = question.id;
            const isCurrentQuestion = index === currentQuestionIndex;
            const isPastQuestion = index < currentQuestionIndex;
            return (
              <Button
                variant={isPastQuestion || isCurrentQuestion ? 'contained' : 'outlined'}
                disableElevation
                color="primary"
                className={classes.progressSivupalkki__button}
                key={questionId}
                onClick={() => setCurrentQuestionIndex(index)}
                {...(isPastQuestion && {
                  endIcon: (
                    <MaterialIcon
                      icon="check"
                      className={classes.progressSivupalkki__buttonIcon}
                    />
                  ),
                  'data-past': true,
                })}
                {...(isCurrentQuestion && { 'data-current': true })}>
                {t(`ohjaava-haku.kysymykset.${questionId}.otsikko`)}
              </Button>
            );
          })}
        </Grid>
      )}
    </>
  );
};
