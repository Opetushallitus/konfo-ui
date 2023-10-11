import React from 'react';

import { Grid } from '@mui/material';
import { some } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useOhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
import { QuestionInfoText, RajainOption } from '#/src/components/ohjaava-haku/Question';
import { RajainItem } from '#/src/types/SuodatinTypes';

import { classes } from './StyledRoot';

export const QuestionWithOptions = ({
  rajainItems,
}: {
  rajainItems?: Array<RajainItem>;
}) => {
  const { t } = useTranslation();

  const { allSelectedRajainValues, toggleAllSelectedRajainValues, question } =
    useOhjaavaHakuContext();

  const { rajainOptionsToBeRemoved, useRajainOptionNameFromRajain } = question;
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
      <Grid item className={classes.question}>
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
      </Grid>
    </Grid>
  );
};
