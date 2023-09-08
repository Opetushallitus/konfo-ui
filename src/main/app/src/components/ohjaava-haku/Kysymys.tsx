import React from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { some } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { KoulutuksenKestoSlider } from '#/src/components/suodattimet/common/KoulutuksenKestoSuodatin';
import { RAJAIN_TYPES, FilterKey } from '#/src/constants';
import { styled } from '#/src/theme';
import { useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';

import { useSearch } from '../../components/haku/hakutulosHooks';
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
  isRajainWithRange?: boolean;
};

export type Rajain = {
  [rajainId: string]:
    | Array<string>
    | { koulutuksenkestokuukausina_min: number; koulutuksenkestokuukausina_max: number };
};

type KysymysProps = {
  kysymys: Kysymys;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
  lastKysymysIndex: number;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  allSelectedRajainValues: Rajain;
  handleSliderValueCommit: (value: Array<number>) => void;
};

export const Kysymys = ({
  kysymys,
  currentKysymysIndex,
  setCurrentKysymysIndex,
  lastKysymysIndex,
  toggleAllSelectedRajainValues,
  allSelectedRajainValues,
  handleSliderValueCommit,
}: KysymysProps) => {
  const { t } = useTranslation();

  const { goToSearchPage, setRajainValues, rajainValues, rajainOptions } = useSearch();
  const { id: kysymysId, rajainOptionTextFromRajain, isRajainWithRange } = kysymys;
  const kysymysTitle = t(`ohjaava-haku.kysymykset.${kysymysId}.otsikko`);
  const kysymysInfo = t(`ohjaava-haku.kysymykset.info-text`);
  const isFirstKysymys = currentKysymysIndex === 0;
  const isLastKysymys = currentKysymysIndex === lastKysymysIndex;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES[kysymysId.toUpperCase() as FilterKey]
  );

  const rajainOptionsToShow = isRajainWithRange
    ? rajainItems
    : rajainItems?.filter(({ id }) => {
        return !some(kysymys.rajainOptionsToBeRemoved, (rajain) => {
          return rajain === id;
        });
      });

  const handleClick = () => {
    setRajainValues(allSelectedRajainValues);
    goToSearchPage();
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
          {isRajainWithRange ? (
            <KoulutuksenKestoSlider
              rajainItems={rajainItems}
              handleSliderValueCommit={handleSliderValueCommit}
            />
          ) : (
            <Grid item className="question">
              {rajainOptionsToShow.map(({ id, rajainId, nimi }) => {
                const selectedRajainItems = allSelectedRajainValues[
                  rajainId
                ] as Array<string>;
                const isRajainSelected =
                  selectedRajainItems && selectedRajainItems.includes(id);
                return (
                  <Button
                    {...(isRajainSelected && {
                      startIcon: <MaterialIcon icon="check" />,
                    })}
                    key={id}
                    onClick={() => toggleAllSelectedRajainValues(id, rajainId)}
                    className="question__option"
                    {...(isRajainSelected && { 'data-selected': true })}>
                    {rajainOptionTextFromRajain
                      ? localize(nimi)
                      : t(`ohjaava-haku.kysymykset.${rajainId}.vaihtoehdot.${id}`)}
                  </Button>
                );
              })}
            </Grid>
          )}
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
