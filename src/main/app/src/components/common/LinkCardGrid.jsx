import React from 'react';

import { Grid } from '@mui/material';

import { LinkCard } from './LinkCard';

export const LinkCardGrid = ({ id, cards }) => {
  return (
    <Grid container spacing={3} direction="column">
      {(cards || []).map((card, index) => (
        <Grid item key={`link-card-grid-${id}-${index}`}>
          <LinkCard sivu={card.sivu} text={card.name} icon={card.icon} />
        </Grid>
      ))}
    </Grid>
  );
};
