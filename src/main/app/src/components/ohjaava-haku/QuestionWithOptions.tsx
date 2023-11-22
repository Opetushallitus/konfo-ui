import React from 'react';

import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { RajainOption } from '#/src/components/ohjaava-haku/common/RajainOption';
import { QuestionInfoText, QuestionType } from '#/src/components/ohjaava-haku/Question';
import { RajainItem } from '#/src/types/SuodatinTypes';

import { StyledQuestion } from './common/StyledQuestion';
import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';
import { getIsRajainSelected, getRajainOptionsToShow } from './utils';

export const QuestionWithOptions = ({
  rajainItems,
  currentQuestion,
}: {
  rajainItems?: Array<RajainItem>;
  currentQuestion: QuestionType;
}) => {
  const { t } = useTranslation();

  const { allSelectedRajainValues, toggleAllSelectedRajainValues } = useOhjaavaHaku(
    (s) => s
  );

  const {
    rajainOptionsToBeRemoved,
    useRajainOptionNameFromRajain,
    rajainOptionsToBeCombined,
  } = currentQuestion;
  const rajainOptionsToShow = getRajainOptionsToShow(
    rajainItems,
    rajainOptionsToBeRemoved,
    rajainOptionsToBeCombined
  );

  return (
    <Grid item container sx={{ width: '100%' }}>
      <QuestionInfoText
        questionInfo={t(`ohjaava-haku.kysymykset.info-text-for-options`)}
      />
      <StyledQuestion item>
        {rajainOptionsToShow.map(({ id, rajainId, nimi, rajainValueIds }) => {
          const isRajainSelected = getIsRajainSelected(
            allSelectedRajainValues,
            rajainId,
            rajainValueIds
          );
          return (
            <RajainOption
              key={id}
              id={id}
              rajainValueIds={rajainValueIds}
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
