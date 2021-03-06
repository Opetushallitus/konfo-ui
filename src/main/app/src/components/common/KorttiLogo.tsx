import React from 'react';

import { makeStyles } from '@material-ui/core';

import oppilaitos_img from '#/src/assets/images/logo-oppilaitos.png';
import koulutus_img from '#/src/assets/images/Opolkuhts.png';

const useStyles = makeStyles((theme) => {
  const common = {
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      float: 'right',
      maxWidth: '125px',
      maxHeight: '100px',
    },
  };

  return {
    oppilaitosKorttiLogo: {
      [theme.breakpoints.up('xs')]: {
        maxWidth: theme.spacing(7),
        maxHeight: theme.spacing(7),
      },
      ...common,
      [theme.breakpoints.up('lg')]: {
        float: 'right',
        maxWidth: '150px',
        maxHeight: '120px',
      },
    },
    koulutusKorttiLogo: {
      [theme.breakpoints.up('xs')]: {
        maxWidth: undefined,
        maxHeight: '150px',
      },
      ...common,
      [theme.breakpoints.up('lg')]: {
        float: 'right',
        maxWidth: '250px',
        maxHeight: '150px',
      },
    },
  };
});

type Props = {
  alt: string;
  image?: string;
};

export const KoulutusKorttiLogo = ({ alt, image }: Props) => {
  const classes = useStyles();
  return (
    <img className={classes.koulutusKorttiLogo} alt={alt} src={image || koulutus_img} />
  );
};

export const OppilaitosKorttiLogo = ({ alt, image }: Props) => {
  const classes = useStyles();
  return (
    <img
      className={classes.oppilaitosKorttiLogo}
      alt={alt}
      src={image || oppilaitos_img}
    />
  );
};
