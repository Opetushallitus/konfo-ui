import React from 'react';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { InfoCard } from './InfoCard';
import { Spacer } from './Spacer';

const PREFIX = 'InfoCardGrid';

const classes = {
  grid: `${PREFIX}-grid`,
};

const StyledGrid = styled(Grid)({
  width: '100%',
});

export const InfoCardGrid = (props) => {
  const { cards, title } = props;

  return (
    <StyledGrid className={classes.grid} container direction="column" alignItems="center">
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
    </StyledGrid>
  );
};
