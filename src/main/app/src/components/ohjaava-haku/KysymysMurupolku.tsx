import React from 'react';

import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

import { Kysymys } from './Kysymys';
import { classes } from './StyledRoot';

export const KysymysMurupolku = ({
  kysymykset,
  currentKysymysIndex,
  setCurrentKysymysIndex,
  isMobile,
}: {
  kysymykset: Array<Kysymys>;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
  isMobile: boolean;
}) => {
  const { t } = useTranslation();
  const progress = `${t('ohjaava-haku.kysymys')} ${
    currentKysymysIndex + 1
  } / ${kysymykset?.length}`;

  return (
    <>
      {isMobile ? (
        <Grid item className={classes.kysymysMurupolku}>
          {progress}
        </Grid>
      ) : (
        <Grid
          container
          item
          direction="column"
          xs={3}
          className={classes.kysymysMurupolku}>
          {kysymykset.map((kysymys, i) => {
            const kysymysId = kysymys.id;
            const isCurrentKysymys = i === currentKysymysIndex;
            const isPastKysymys = i < currentKysymysIndex;
            return (
              <Button
                variant={isPastKysymys || isCurrentKysymys ? 'contained' : 'outlined'}
                disableElevation
                color="primary"
                className={classes.kysymysMurupolku__button}
                key={kysymysId}
                onClick={() => setCurrentKysymysIndex(i)}
                {...(isPastKysymys && {
                  endIcon: (
                    <MaterialIcon
                      icon="check"
                      className={classes.kysymysMurupolku__button__icon}
                    />
                  ),
                  'data-past': true,
                })}
                {...(isCurrentKysymys && { 'data-current': true })}>
                {t(`ohjaava-haku.kysymykset.${kysymysId}.otsikko`)}
              </Button>
            );
          })}
        </Grid>
      )}
    </>
  );
};
