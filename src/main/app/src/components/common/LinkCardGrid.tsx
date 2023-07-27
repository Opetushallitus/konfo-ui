import React from 'react';

import { Grid } from '@mui/material';

import { ContentfulLehti } from '#/src/types/ContentfulTypes';

import { LinkCard } from './LinkCard';

export const LinkCardGrid = ({
  id,
  cards = [],
}: {
  id: string;
  cards?: Array<ContentfulLehti>;
}) => {
  return (
    <Grid container spacing={3} direction="column">
      {cards.map((card, index) => (
        <Grid item key={`link-card-grid-${id}-${index}`}>
          <LinkCard sivu={card.sivu} text={card.name} icon={card.icon} />
        </Grid>
      ))}
    </Grid>
  );
};
