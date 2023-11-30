import React, { useState } from 'react';

import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { KoulutuksenKesto } from '#/src/components/ohjaava-haku/KoulutuksenKesto';
import { Maksullisuus } from '#/src/components/ohjaava-haku/Maksullisuus';
import { RAJAIN_TYPES } from '#/src/constants';
import { styled } from '#/src/theme';
import { useRajainItems } from '#/src/tools/filters';

import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';
import { NavigationButtons } from './NavigationButtons';
import { QuestionWithOptions } from './QuestionWithOptions';
import { useSearch } from '../../components/haku/hakutulosHooks';
import { Heading } from '../Heading';

export type CombinedRajaimet = {
  translationKey: string;
  rajainKoodiuris: Array<string>;
};

export type QuestionType = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
  optionOrder?: Array<string>;
  rajainOptionsToBeCombined?: Array<CombinedRajaimet>;
};

export type Rajain = {
  [rajainId: string]:
    | Array<string>
    | { koulutuksenkestokuukausina_min: number; koulutuksenkestokuukausina_max: number }
    | { maksunmaara_min: number; maksunmaara_max: number }
    | { lukuvuosimaksunmaara_min: number; lukuvuosimaksunmaara_max: number };
};

type RajainKey = keyof typeof RAJAIN_TYPES;

const QuestionContainer = styled(Grid)(({ theme }) => ({
  maxWidth: '75%',
  margin: '0 2rem',

  [theme.breakpoints.down('md')]: {
    margin: '0 1rem',
  },

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    margin: 0,

    h2: {
      fontSize: '1.75rem',
    },
  },
}));

export const QuestionInfoText = ({ questionInfo }: { questionInfo: string }) => (
  <Grid item xs={12} marginBottom="1rem">
    <Typography>{questionInfo}</Typography>
  </Grid>
);

export const Question = ({
  refElement,
}: {
  refElement?: React.RefObject<HTMLButtonElement>;
}) => {
  const { t } = useTranslation();

  const { currentQuestionIndex, questions } = useOhjaavaHaku((s) => s);
  const question = questions[currentQuestionIndex];

  const { rajainValues, rajainOptions, isFetching } = useSearch();
  const { id: questionId, optionOrder: rajainOrder } = question;
  const questionTitle = t(`ohjaava-haku.kysymykset.${questionId}.otsikko`);

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES[questionId.toUpperCase() as RajainKey]
  );

  const sortedRajainItems = rajainOrder
    ? rajainItems.sort(
        (itemA, itemB) => rajainOrder.indexOf(itemA.id) - rajainOrder.indexOf(itemB.id)
      )
    : rajainItems;

  const [errorKey, setErrorKey] = useState('');

  return (
    <QuestionContainer container item>
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
                rajainItems={sortedRajainItems}
                setErrorKey={setErrorKey}
                errorKey={errorKey}
              />
            ) : questionId == 'maksullisuus' ? (
              <Maksullisuus
                rajainItems={sortedRajainItems}
                setErrorKey={setErrorKey}
                errorKey={errorKey}
              />
            ) : (
              <QuestionWithOptions
                currentQuestion={question}
                rajainItems={sortedRajainItems}
              />
            )}
          </Grid>
        )}
      </Grid>
      <NavigationButtons errorKey={errorKey} refElement={refElement} />
    </QuestionContainer>
  );
};
