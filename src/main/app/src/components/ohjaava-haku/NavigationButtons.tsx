import React from 'react';

import { Grid } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { StyledButton } from '#/src/components/ohjaava-haku/common/StyledButton';
import { styled } from '#/src/theme';

import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';
import { useSearch } from '../../components/haku/hakutulosHooks';

const ButtonContainer = styled(Grid)(({ theme }) => ({
  margin: '1rem 0',
  display: 'grid',
  gridTemplateColumns: '25fr 25fr 25fr 25fr',
  gridTemplateRows: 'auto',
  gridTemplateAreas: `"previous . results next"`,
  gridGap: '1rem',

  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: '25fr 25fr 25fr 25fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      "next next next next"
      "previous previous previous previous"
      "results results results results"
    `,
    gap: '0.5rem 0',
    margin: '1rem 0',
  },
}));

const ButtonNext = styled(StyledButton)({
  gridArea: 'next',
});

const ButtonPrevious = styled(StyledButton)(({ theme }) => ({
  gridArea: 'previous',
  fontWeight: 'bold',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const ButtonResults = styled(StyledButton)({
  gridArea: 'results',
  fontWeight: 'bold',
});

const setFocus = (refElement?: React.RefObject<HTMLButtonElement>) => {
  if (refElement && refElement.current) {
    refElement.current.focus();
  }
};

export const NavigationButtons = ({
  errorKey,
  refElement,
}: {
  errorKey: string;
  refElement?: React.RefObject<HTMLButtonElement>;
}) => {
  const { t } = useTranslation();

  const { goToSearchPage, setRajainValues } = useSearch();

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    lastQuestionIndex,
    allSelectedRajainValues,
  } = useOhjaavaHaku((s) => s);

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === lastQuestionIndex;

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setFocus(refElement);
    window.scrollTo(0, 0);
  };

  const moveToPreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setFocus(refElement);
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
      {...(isLastQuestion && {
        sx: {
          gridTemplateColumns: '25% 25% 25% 25%',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"previous . . results"`,
        },
      })}>
      {!isLastQuestion && (
        <ButtonNext
          onClick={moveToNextQuestion}
          variant="contained"
          color="primary"
          disabled={!isEmpty(errorKey)}
          aria-disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.seuraava')}
        </ButtonNext>
      )}
      {!isFirstQuestion && (
        <ButtonPrevious
          onClick={moveToPreviousQuestion}
          variant="outlined"
          color="primary"
          disabled={!isEmpty(errorKey)}
          aria-disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.edellinen')}
        </ButtonPrevious>
      )}
      {
        <ButtonResults
          onClick={seeResults}
          color="primary"
          variant={isLastQuestion ? 'contained' : 'text'}
          disabled={!isEmpty(errorKey)}
          aria-disabled={!isEmpty(errorKey)}>
          {t('ohjaava-haku.katso-tulokset')}
        </ButtonResults>
      }
    </ButtonContainer>
  );
};
