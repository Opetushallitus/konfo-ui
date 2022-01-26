import React from 'react';

import { Grid, Typography, makeStyles } from '@material-ui/core';

import TreeImage from '../../assets/images/ammatillinen_koulutus_puu.svg'; //TODO: This should probably be a prop
import LinkCardGrid from './LinkCardGrid';
import Spacer from './Spacer';

const useStyles = makeStyles((theme) => ({
  treeContainer: {
    [theme.breakpoints.up('lg')]: {
      backgroundImage: `url(${TreeImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backGroundSize: 'cover',
      height: '960px',
    },
  },
}));

const Tree = ({ id, title, cardsLeft, cardsRight }) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item>
        <Spacer />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        className={classes.treeContainer}
        spacing={10}>
        <Grid item xs={12} lg={4}>
          <LinkCardGrid id={`${id}-left`} cards={cardsLeft} />
        </Grid>
        <Grid item lg={3} />
        <Grid item xs={12} lg={4}>
          <LinkCardGrid id={`${id}-right`} cards={cardsRight} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Tree;
