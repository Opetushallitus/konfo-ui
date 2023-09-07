import React from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { some } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { RAJAIN_TYPES, FilterKey } from '#/src/constants';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';

import {
  useRajainOptionsForKysymys,
  useSearch,
} from '../../components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '../Heading';

const Root = styled('div')`
  & .question {
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
   margin-bottom: 1rem;

   &__option {
     justify-content: start;
     background-color: #e3ecdd;
     color: ${colors.black};
     padding-left: 1rem;
     padding-right: 1rem;

     &:hover {
       background-color: #a5c291;
     }

     &[data-selected] {
       background-color: ${colors.brandGreen};
       color: ${colors.white};
     }
  }
`;

type Kysymys = {
  id: string;
  rajainOptionTextFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
};

export type Rajain = {
  [rajainId: string]: Array<string>;
};

type KysymysProps = {
  kysymys: Kysymys;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
  lastKysymysIndex: number;
  toggleAllSelectedRajainValues: (rajainId: string, filterId: string) => void;
  allSelectedRajainValues: Rajain;
};

export const Kysymys = ({
  kysymys,
  currentKysymysIndex,
  setCurrentKysymysIndex,
  lastKysymysIndex,
  toggleAllSelectedRajainValues,
  allSelectedRajainValues,
}: KysymysProps) => {
  const { t } = useTranslation();
  const { goToSearchPage, setRajainValues } = useSearch();

  const kysymysId = kysymys.id;
  const kysymysTitle = t(`ohjaava-haku.kysymykset.${kysymysId}.otsikko`);
  const kysymysInfo = t(`ohjaava-haku.kysymykset.info-text`);
  const isFirstKysymys = currentKysymysIndex === 0;
  const isLastKysymys = currentKysymysIndex === lastKysymysIndex;

  const rajainOptionsFromKonfoBackend = useRajainOptionsForKysymys(
    RAJAIN_TYPES[kysymysId.toUpperCase() as FilterKey]
  );
  const { rajainOptionTextFromRajain } = kysymys;
  const rajainOptionsToShow = rajainOptionsFromKonfoBackend.filter(({ id }) => {
    return !some(kysymys.rajainOptionsToBeRemoved, (rajain) => {
      return rajain === id;
    });
  });

  const handleClick = () => {
    setRajainValues(allSelectedRajainValues);
    goToSearchPage();
  };

  const isSelected = (filterId: string, id: string) => {
    return (
      allSelectedRajainValues[filterId] && allSelectedRajainValues[filterId].includes(id)
    );
  };

  return (
    <Root>
      <HeadingBoundary>
        <Grid container width="100%" alignItems="start">
          <Grid item xs={12}>
            <Heading variant="h2">{kysymysTitle}</Heading>
          </Grid>
          <Grid item xs={12} marginBottom="2rem">
            <Typography>{kysymysInfo}</Typography>
          </Grid>
          <Grid item className="question">
            {rajainOptionsToShow.map(({ id, filterId, nimi }) => {
              const isRajainSelected = isSelected(filterId, id);
              return (
                <Button
                  {...(isRajainSelected && {
                    startIcon: <MaterialIcon icon="check" />,
                  })}
                  key={id}
                  onClick={() => toggleAllSelectedRajainValues(id, filterId)}
                  className="question__option"
                  {...(isRajainSelected && { 'data-selected': true })}>
                  {rajainOptionTextFromRajain
                    ? localize(nimi)
                    : t(`ohjaava-haku.kysymykset.${filterId}.vaihtoehdot.${id}`)}
                </Button>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            {!isFirstKysymys && (
              <Button
                onClick={() => setCurrentKysymysIndex(currentKysymysIndex - 1)}
                variant="outlined"
                color="primary">
                {t('ohjaava-haku.edellinen')}
              </Button>
            )}
            {isLastKysymys ? (
              <Button onClick={handleClick} variant="contained" color="primary">
                {t('ohjaava-haku.katso-tulokset')}
              </Button>
            ) : (
              <Button onClick={handleClick} variant="text" color="primary">
                {t('ohjaava-haku.katso-tulokset')}
              </Button>
            )}

            {!isLastKysymys && (
              <Button
                onClick={() => setCurrentKysymysIndex(currentKysymysIndex + 1)}
                variant="contained"
                color="primary">
                {t('ohjaava-haku.seuraava')}
              </Button>
            )}
          </Grid>
        </Grid>
      </HeadingBoundary>
    </Root>
  );
};
