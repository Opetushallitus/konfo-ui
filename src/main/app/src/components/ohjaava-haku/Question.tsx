import React, { useState } from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { KoulutuksenKesto } from '#/src/components/ohjaava-haku/KoulutuksenKesto';
import { Maksullisuus } from '#/src/components/ohjaava-haku/Maksullisuus';
import { useOhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
import { RAJAIN_TYPES } from '#/src/constants';
import { styled } from '#/src/theme';
import { useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { NavigationButtons } from './NavigationButtons';
import { QuestionWithOptions } from './QuestionWithOptions';
import { useSearch } from '../../components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '../Heading';

export type QuestionType = {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
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

const OptionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'start',
  backgroundColor: colors.lightGrayishGreenBg,
  color: colors.black,
  paddingLeft: '1rem',
  paddingLight: '1rem',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },

  '&:hover': {
    backgroundColor: '#a5c291',
  },

  '&[data-selected]': {
    backgroundColor: colors.brandGreen,
    color: colors.white,
  },
}));

export const RajainOption = ({
  id,
  useRajainOptionNameFromRajain,
  isRajainSelected,
  nimi,
  rajainId,
  toggleAllSelectedRajainValues,
}: {
  id: string;
  useRajainOptionNameFromRajain?: boolean;
  isRajainSelected?: boolean;
  nimi?: Translateable;
  rajainId: string;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <OptionButton
      {...(isRajainSelected && {
        startIcon: <MaterialIcon icon="check" />,
      })}
      key={id}
      onClick={() => toggleAllSelectedRajainValues(id, rajainId)}
      {...(isRajainSelected && { 'data-selected': true })}>
      {useRajainOptionNameFromRajain
        ? localize(nimi)
        : t(`ohjaava-haku.kysymykset.${rajainId}.vaihtoehdot.${id}`)}
    </OptionButton>
  );
};

export const QuestionInfoText = ({ questionInfo }: { questionInfo: string }) => (
  <Grid item xs={12} marginBottom="1rem">
    <Typography>{questionInfo}</Typography>
  </Grid>
);

export const Question = () => {
  const { t } = useTranslation();

  const { question } = useOhjaavaHakuContext();

  const { rajainValues, rajainOptions, isFetching } = useSearch();
  const { id: questionId } = question;
  const questionTitle = t(`ohjaava-haku.kysymykset.${questionId}.otsikko`);

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES[questionId.toUpperCase() as RajainKey]
  );

  const [errorKey, setErrorKey] = useState('');

  return (
    <HeadingBoundary>
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
                  rajainItems={rajainItems}
                  setErrorKey={setErrorKey}
                  errorKey={errorKey}
                />
              ) : questionId == 'maksullisuus' ? (
                <Maksullisuus
                  rajainItems={rajainItems}
                  setErrorKey={setErrorKey}
                  errorKey={errorKey}
                />
              ) : (
                <QuestionWithOptions rajainItems={rajainItems} />
              )}
            </Grid>
          )}
        </Grid>
        <NavigationButtons errorKey={errorKey} />
      </QuestionContainer>
    </HeadingBoundary>
  );
};
