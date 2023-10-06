import React from 'react';

import { Grid } from '@mui/material';
import { some } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  Question,
  QuestionInfoText,
  RajainOption,
  Rajain,
} from '#/src/components/ohjaava-haku/Question';
import { RajainItem } from '#/src/types/SuodatinTypes';

import { classes } from './StyledRoot';

export const QuestionWithOptions = ({
  question,
  rajainItems,
  allSelectedRajainValues,
  toggleAllSelectedRajainValues,
}: {
  question: Question;
  rajainItems?: Array<RajainItem>;
  allSelectedRajainValues: Rajain;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
}) => {
  const { t } = useTranslation();

  const { rajainOptionsToBeRemoved, isRajainOptionTextFromRajain } = question;
  const rajainOptionsToShow = rajainItems?.filter(({ id }) => {
    return !some(rajainOptionsToBeRemoved, (rajain) => {
      return rajain === id;
    });
  });

  return (
    <>
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
              isRajainOptionTextFromRajain={isRajainOptionTextFromRajain}
              isRajainSelected={isRajainSelected}
              nimi={nimi}
              rajainId={rajainId}
              toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
            />
          );
        })}
      </Grid>
    </>
  );
};
