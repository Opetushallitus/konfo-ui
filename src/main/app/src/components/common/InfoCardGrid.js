import React from 'react';

import { Grid, Typography, makeStyles } from '@material-ui/core';

import InfoCard from './InfoCard';
import Spacer from './Spacer';

const useStyles = makeStyles({
  grid: {
    width: '100%',
  },
});

const InfoCardGrid = (props) => {
  const { cards, title } = props;
  const classes = useStyles();

  return (
    <Grid className={classes.grid} container direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item>
        <Spacer />
      </Grid>
      <Grid item container spacing={3} align="center" justifyContent="center">
        {cards.map((cardData, index) => (
          <Grid item xs={12} md={6} lg={4} key={`info-card-grid-${index}`}>
            <InfoCard {...cardData} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default InfoCardGrid;
