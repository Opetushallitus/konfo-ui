import React from 'react';

import { Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';

import { Palvelu } from './Palvelu';

const PREFIX = 'Palvelut';

const classes = {
  header: `${PREFIX}-header`,
  spaceOnBorders: `${PREFIX}-spaceOnBorders`,
  smSpaceOnBorders: `${PREFIX}-smSpaceOnBorders`,
  palvelut: `${PREFIX}-palvelut`,
  rivi: `${PREFIX}-rivi`,
};

const Root = styled('div')({
  [`& .${classes.header}`]: {
    fontSize: '28px',
    paddingTop: '60px',
    paddingBottom: '28px',
    fontWeight: 700,
  },
  [`&.${classes.spaceOnBorders}`]: {
    paddingLeft: 90,
    paddingRight: 90,
  },
  [`& .${classes.smSpaceOnBorders}`]: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  [`&.${classes.palvelut}`]: {
    backgroundColor: colors.white,
    paddingBottom: '100px',
  },
  [`& .${classes.rivi}`]: {
    overflow: 'hidden',
    paddingBottom: '24px',
  },
});

type RiviProps = { otsikko: string; kortit?: Array<{ id: string }> };

const Rivi = ({ otsikko, kortit }: RiviProps) => {
  return kortit ? (
    <Grid container className={classes.rivi}>
      <Typography className={classes.header} variant="h1" component="h2">
        {otsikko}
      </Typography>
      <Grid container spacing={3}>
        {kortit.map((p) => (
          <Palvelu id={p.id} key={p.id} />
        ))}
      </Grid>
    </Grid>
  ) : null;
};

const first = (entry: object) => Object.values(entry || [])[0] || {};

export const Palvelut = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const { data } = useContentful();
  const { ohjeetJaTuki, palvelut } = data || {};

  const palveluKortit: Array<any> = first(palvelut).linkit;
  const ohjeetJaTukiKortit: Array<any> = first(ohjeetJaTuki).linkit;

  return (
    <Root
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
    </Root>
  );
};
