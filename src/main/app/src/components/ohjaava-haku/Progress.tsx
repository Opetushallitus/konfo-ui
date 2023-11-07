import React from 'react';

import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { StyledButton } from '#/src/components/ohjaava-haku/common/StyledButton';
import { styled } from '#/src/theme';

import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';
import { QuestionType } from './Question';

const MobileProgressBar = ({ progress }: { progress: string }) => {
  return (
    <Grid item sx={{ marginBottom: '1rem' }}>
      {progress}
    </Grid>
  );
};

const ProgressSivupalkki = styled(Grid)({
  display: 'flex',
  gap: '0.2rem',
  marginBottom: '1rem',
  maxWidth: '25%',
});

export const Progress = () => {
  const { currentQuestionIndex, setCurrentQuestionIndex, questions } = useOhjaavaHaku(
    (s) => s
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const progressStr = `${t('ohjaava-haku.question')} ${
    currentQuestionIndex + 1
  } / ${questions?.length}`;

  return (
    <>
      {isMobile ? (
        <MobileProgressBar progress={progressStr} />
      ) : (
        <ProgressSivupalkki container item direction="column">
          {questions.map((question: QuestionType, index: number) => {
            const questionId = question.id;
            const isCurrentQuestion = index === currentQuestionIndex;
            const isPastQuestion = index < currentQuestionIndex;
            return (
              <StyledButton
                variant={isPastQuestion || isCurrentQuestion ? 'contained' : 'outlined'}
                disableElevation
                disableFocusRipple
                color="primary"
                sx={{
                  maxWidth: '100%',
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                  color: colors.black,
                  backgroundColor: isCurrentQuestion
                    ? colors.brightGreenBg
                    : isPastQuestion
                    ? colors.lightGrayishGreenBg
                    : 'initial',
                  marginTop: '0.25rem',
                  '&:hover': {
                    backgroundColor: colors.darkerGrayishGreenBg,
                  },
                }}
                key={questionId}
                onClick={() => setCurrentQuestionIndex(index)}
                {...(isPastQuestion && {
                  endIcon: (
                    <MaterialIcon icon="check" sx={{ color: colors.brandGreen }} />
                  ),
                })}>
                {t(`ohjaava-haku.kysymykset.${questionId}.otsikko`)}
              </StyledButton>
            );
          })}
        </ProgressSivupalkki>
      )}
    </>
  );
};
