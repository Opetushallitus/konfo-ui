import React from 'react';

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

import { Palvelu } from './Palvelu';

const useStyles = makeStyles({
  header: {
    fontSize: '28px',
    paddingTop: '60px',
    paddingBottom: '28px',
    fontWeight: 700,
  },
  spaceOnBorders: {
    paddingLeft: 90,
    paddingRight: 90,
  },
  smSpaceOnBorders: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  palvelut: {
    backgroundColor: colors.white,
    paddingBottom: '100px',
  },
  rivi: {
    overflow: 'hidden',
    paddingBottom: '24  px',
  },
});

type RiviProps = { otsikko: string; kortit: Array<{ id: string }> };

const Rivi = ({ otsikko, kortit }: RiviProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.rivi}>
        <Typography className={classes.header} variant="h1" component="h2">
          {otsikko}
        </Typography>
        <Grid container spacing={3}>
          {kortit?.map((p) => (
            <Palvelu id={p.id} key={p.id} />
          ))}
        </Grid>
      </Grid>
    </>
  );
};

const first = (entry: object) => Object.values(entry || [])[0] || {};

export const Palvelut = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const { data } = useContentful();
  const { ohjeetJaTuki, palvelut } = data || {};

  const palveluKortit: Array<any> = first(palvelut).linkit;
  const ohjeetJaTukiKortit: Array<any> = first(ohjeetJaTuki).linkit;

  return (
    <div
      className={clsx(
        classes.palvelut,
        matches ? classes.spaceOnBorders : classes.smSpaceOnBorders
      )}>
      <Grid container>
        <Rivi otsikko={t('palvelut.otsikko-muut-palvelut')} kortit={palveluKortit} />
        <Rivi
          otsikko={t('palvelut.otsikko-ohjeet-ja-tuki')}
          kortit={ohjeetJaTukiKortit}
        />
      </Grid>
    </div>
  );
};
