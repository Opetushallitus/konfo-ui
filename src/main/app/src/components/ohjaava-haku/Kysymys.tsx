import React, { useState } from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { isEmpty, some } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { KoulutuksenKesto } from '#/src/components/ohjaava-haku/KoulutuksenKesto';
import { Maksullisuus } from '#/src/components/ohjaava-haku/Maksullisuus';
import { RAJAIN_TYPES, FilterKey } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { classes, StyledRoot } from './StyledRoot';
import { useSearch } from '../../components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '../Heading';

type Kysymys = {
  id: string;
  isRajainOptionTextFromRajain?: boolean;
  rajainOptionsToBeRemoved?: Array<string>;
  isCustomComponent?: boolean;
};

export type Rajain = {
  [rajainId: string]:
    | Array<string>
    | { koulutuksenkestokuukausina_min: number; koulutuksenkestokuukausina_max: number }
    | { maksunmaara_min: number; maksunmaara_max: number }
    | { lukuvuosimaksunmaara_min: number; lukuvuosimaksunmaara_max: number };
};

export const RajainOption = ({
  id,
  isRajainOptionTextFromRajain,
  isRajainSelected,
  nimi,
  rajainId,
  toggleAllSelectedRajainValues,
}: {
  id: string;
  isRajainOptionTextFromRajain?: boolean;
  isRajainSelected?: boolean;
  nimi?: Translateable;
  rajainId: string;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Button
      {...(isRajainSelected && {
        startIcon: <MaterialIcon icon="check" />,
      })}
      key={id}
      onClick={() => toggleAllSelectedRajainValues(id, rajainId)}
      className={classes.question__option}
      {...(isRajainSelected && { 'data-selected': true })}>
      {isRajainOptionTextFromRajain
        ? localize(nimi)
        : t(`ohjaava-haku.kysymykset.${rajainId}.vaihtoehdot.${id}`)}
    </Button>
  );
};

type KysymysProps = {
  kysymys: Kysymys;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
  lastKysymysIndex: number;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  allSelectedRajainValues: Rajain;
  setAllSelectedRajainValues: (val: Rajain) => void;
};

export const Kysymys = ({
  kysymys,
  currentKysymysIndex,
  setCurrentKysymysIndex,
  lastKysymysIndex,
  toggleAllSelectedRajainValues,
  allSelectedRajainValues,
  setAllSelectedRajainValues,
}: KysymysProps) => {
  const { t } = useTranslation();

  const { goToSearchPage, setRajainValues, rajainValues, rajainOptions } = useSearch();
  const { id: kysymysId, isRajainOptionTextFromRajain, isCustomComponent } = kysymys;
  const kysymysTitle = t(`ohjaava-haku.kysymykset.${kysymysId}.otsikko`);
  const kysymysInfo = t(`ohjaava-haku.kysymykset.info-text`);
  const isFirstKysymys = currentKysymysIndex === 0;
  const isLastKysymys = currentKysymysIndex === lastKysymysIndex;
  const [errorKey, setErrorKey] = useState('');

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES[kysymysId.toUpperCase() as FilterKey]
  );

  const rajainOptionsToShow = rajainItems?.filter(({ id }) => {
    return !some(kysymys.rajainOptionsToBeRemoved, (rajain) => {
      return rajain === id;
    });
  });

  const handleClick = () => {
    setRajainValues(allSelectedRajainValues);
    goToSearchPage();
  };

  return (
    <StyledRoot>
      <HeadingBoundary>
        <Grid container>
          <Grid item xs={12}>
            <Heading variant="h2">{kysymysTitle}</Heading>
          </Grid>
          <Grid item xs={12} marginBottom="2rem">
            <Typography>{kysymysInfo}</Typography>
          </Grid>
          {isCustomComponent && kysymysId == 'koulutuksenkestokuukausina' ? (
            <KoulutuksenKesto
              rajainItems={rajainItems}
              allSelectedRajainValues={allSelectedRajainValues}
              setAllSelectedRajainValues={setAllSelectedRajainValues}
              setErrorKey={setErrorKey}
              errorKey={errorKey}
            />
          ) : isCustomComponent && kysymysId == 'maksullisuus' ? (
            <Maksullisuus
              rajainItems={rajainItems}
              allSelectedRajainValues={allSelectedRajainValues}
              toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
              setAllSelectedRajainValues={setAllSelectedRajainValues}
              setErrorKey={setErrorKey}
              errorKey={errorKey}
            />
          ) : (
            <Grid item className={classes.question}>
              {rajainOptionsToShow.map(({ id, rajainId, nimi }) => {
                const selectedRajainItems = allSelectedRajainValues[
                  rajainId
                ] as Array<string>;
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
          )}
          <Grid item xs={12}>
            {!isFirstKysymys && (
              <Button
                onClick={() => setCurrentKysymysIndex(currentKysymysIndex - 1)}
                variant="outlined"
                color="primary"
                {...(!isEmpty(errorKey) && { disabled: true })}>
                {t('ohjaava-haku.edellinen')}
              </Button>
            )}
            {
              <Button
                onClick={handleClick}
                color="primary"
                {...(isLastKysymys ? { variant: 'contained' } : { variant: 'text' })}
                {...(!isEmpty(errorKey) && { disabled: true })}>
                {t('ohjaava-haku.katso-tulokset')}
              </Button>
            }

            {!isLastKysymys && (
              <Button
                onClick={() => setCurrentKysymysIndex(currentKysymysIndex + 1)}
                variant="contained"
                color="primary"
                {...(!isEmpty(errorKey) && { disabled: true })}>
                {t('ohjaava-haku.seuraava')}
              </Button>
            )}
          </Grid>
        </Grid>
      </HeadingBoundary>
    </StyledRoot>
  );
};
