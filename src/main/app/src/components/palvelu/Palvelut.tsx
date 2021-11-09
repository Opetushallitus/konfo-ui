import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import clsx from 'clsx';
import _ from 'lodash';
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
    paddingBottom: '24px',
  },
});

type RiviProps = { otsikko: string; rivit: Array<Array<{ id: string }>> };

const Rivi = ({ otsikko, rivit }: RiviProps) => {
  const classes = useStyles();

  return (
    <>
      {rivit?.length > 0 ? <h1 className={classes.header}>{otsikko}</h1> : ''}
      {rivit.map((rivi) => (
        <Grid container className={classes.rivi} key={rivi.map((u) => u.id).join()}>
          <Grid container spacing={3}>
            {rivi.map((p) => (
              <Palvelu id={p.id} key={p.id} />
            ))}
          </Grid>
        </Grid>
      ))}
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

  const palvelurivit: Array<Array<any>> = _.chunk(first(palvelut).linkit, 3);
  const ohjerivit: Array<Array<any>> = _.chunk(first(ohjeetJaTuki).linkit, 3);

  return (
    <div
      className={clsx(
        classes.palvelut,
        matches ? classes.spaceOnBorders : classes.smSpaceOnBorders
      )}>
      <Grid container>
        <Rivi otsikko={t('palvelut.otsikko-muut-palvelut')} rivit={palvelurivit} />
        <Rivi otsikko={t('palvelut.otsikko-ohjeet-ja-tuki')} rivit={ohjerivit} />
      </Grid>
    </div>
  );
};
