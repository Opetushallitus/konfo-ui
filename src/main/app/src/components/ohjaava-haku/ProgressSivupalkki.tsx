import React from 'react';

import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

import { Kysymys } from './Kysymys';
import { classes } from './StyledRoot';

export const ProgressSivupalkki = ({
  kysymykset,
  currentKysymysIndex,
  setCurrentKysymysIndex,
}: {
  kysymykset: Array<Kysymys>;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const progress = `${t('ohjaava-haku.kysymys')} ${
    currentKysymysIndex + 1
  } / ${kysymykset?.length}`;

  return (
    <>
      {isMobile ? (
        <Grid item sx={{ marginBottom: '1rem' }}>
          {progress}
        </Grid>
      ) : (
        <Grid container item direction="column" className={classes.progressSivupalkki}>
          {kysymykset.map((kysymys, index) => {
            const kysymysId = kysymys.id;
            const isCurrentKysymys = index === currentKysymysIndex;
            const isPastKysymys = index < currentKysymysIndex;
            return (
              <Button
                variant={isPastKysymys || isCurrentKysymys ? 'contained' : 'outlined'}
                disableElevation
                color="primary"
                className={classes.progressSivupalkki__button}
                key={kysymysId}
                onClick={() => setCurrentKysymysIndex(index)}
                {...(isPastKysymys && {
                  endIcon: (
                    <MaterialIcon
                      icon="check"
                      className={classes.progressSivupalkki__buttonIcon}
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
