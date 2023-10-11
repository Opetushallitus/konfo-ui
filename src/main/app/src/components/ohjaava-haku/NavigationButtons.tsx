import React from 'react';

import { Button, Grid } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useOhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
import { styled } from '#/src/theme';

import { useSearch } from '../../components/haku/hakutulosHooks';

const PREFIX = 'ohjaava-haku__';

const classes = {
  lastQuestion: `${PREFIX}buttonContainer-last-question`,
  buttonPrevious: `${PREFIX}button-previous`,
  buttonNext: `${PREFIX}button-next`,
  buttonResults: `${PREFIX}button-results`,
};

export const ButtonContainer = styled(Grid)(({ theme }) => ({
  margin: '1rem 0',
  display: 'grid',
  gridTemplateColumns: '25% 25% 25% 25%',
  gridTemplateRows: 'auto',
  gridTemplateAreas: `"previous . results next"`,

  [`& .${classes.buttonPrevious}`]: {
    gridArea: 'previous',
    fontWeight: 'bold',
  },

  [`& .${classes.buttonNext}`]: {
    gridArea: 'next',
  },

  [`& .${classes.buttonResults}`]: {
    gridArea: 'results',
    fontWeight: 'bold',
  },

  [`&.${classes.lastQuestion}`]: {
    gridTemplateColumns: '25% 25% 25% 25%',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `"previous . . results"`,
  },

  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      "next next next next"
      "previous previous previous previous"
      "results results results results"
    `,
    gap: '0.5rem 0',
    margin: '1rem 0',

    [`& .${classes.buttonPrevious}`]: {
      width: '100%',
    },
  },
}));

export const NavigationButtons = ({ errorKey }: { errorKey: string }) => {
  const { t } = useTranslation();

  const { goToSearchPage, setRajainValues } = useSearch();

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    lastQuestionIndex,
    allSelectedRajainValues,
  } = useOhjaavaHakuContext();

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === lastQuestionIndex;

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
    <ButtonContainer
      item
      xs={12}
      {...(isLastQuestion && { className: classes.lastQuestion })}>
      {!isLastQuestion && (
        <Button
          className={classes.buttonNext}
          onClick={moveToNextQuestion}
          variant="contained"
          color="primary"
          disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.seuraava')}
        </Button>
      )}
      {!isFirstQuestion && (
        <Button
          className={classes.buttonPrevious}
          onClick={moveToPreviousQuestion}
          variant="outlined"
          color="primary"
          disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.edellinen')}
        </Button>
      )}
      {
        <Button
          className={classes.buttonResults}
          onClick={seeResults}
          color="primary"
          variant={isLastQuestion ? 'contained' : 'text'}
          disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.katso-tulokset')}
        </Button>
      }
    </ButtonContainer>
  );
};
