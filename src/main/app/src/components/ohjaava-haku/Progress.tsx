import React from 'react';

import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useQuestionsStore } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
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
  const questions = useQuestionsStore((state) => state.questions);
  const { currentQuestionIndex, setCurrentQuestionIndex } = useOhjaavaHaku();
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
              <Button
                variant={isPastQuestion || isCurrentQuestion ? 'contained' : 'outlined'}
                disableElevation
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
                }}
                key={questionId}
                onClick={() => setCurrentQuestionIndex(index)}
                {...(isPastQuestion && {
                  endIcon: (
                    <MaterialIcon icon="check" sx={{ color: colors.brandGreen }} />
                  ),
                })}>
                {t(`ohjaava-haku.kysymykset.${questionId}.otsikko`)}
              </Button>
            );
          })}
        </ProgressSivupalkki>
      )}
    </>
  );
};
