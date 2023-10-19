import React from 'react';

import { Grid } from '@mui/material';
import { some } from 'lodash';
import { useTranslation } from 'react-i18next';

import { RajainOption } from '#/src/components/ohjaava-haku/common/RajainOption';
import { QuestionInfoText, QuestionType } from '#/src/components/ohjaava-haku/Question';
import { RajainItem } from '#/src/types/SuodatinTypes';

import { StyledQuestion } from './common/StyledQuestion';
import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';

export const QuestionWithOptions = ({
  rajainItems,
  currentQuestion,
}: {
  rajainItems?: Array<RajainItem>;
  currentQuestion: QuestionType;
}) => {
  const { t } = useTranslation();

  const { allSelectedRajainValues, toggleAllSelectedRajainValues } = useOhjaavaHaku();

  const { rajainOptionsToBeRemoved, useRajainOptionNameFromRajain } = currentQuestion;
  const rajainOptionsToShow = rajainItems?.filter(({ id }) => {
    return !some(rajainOptionsToBeRemoved, (rajain) => {
      return rajain === id;
    });
  });

  return (
    <Grid item container sx={{ width: '100%' }}>
      <QuestionInfoText
        questionInfo={t(`ohjaava-haku.kysymykset.info-text-for-options`)}
      />
      <StyledQuestion item>
        {rajainOptionsToShow?.map(({ id, rajainId, nimi }) => {
          const selectedRajainItems = allSelectedRajainValues[rajainId] as Array<string>;
          const isRajainSelected =
            selectedRajainItems && selectedRajainItems.includes(id);
          return (
            <RajainOption
              key={id}
              id={id}
              useRajainOptionNameFromRajain={useRajainOptionNameFromRajain}
              isRajainSelected={isRajainSelected}
              nimi={nimi}
              rajainId={rajainId}
              toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
            />
          );
        })}
      </StyledQuestion>
    </Grid>
  );
};
