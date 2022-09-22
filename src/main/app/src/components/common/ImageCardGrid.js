import React from 'react';

import { Grid, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import ImageCardWithText from '#/src/components/common/ImageCardWithText';

import { LocalizedLink } from './LocalizedLink';

export const ImageCardGrid = (props) => {
  const { cards, cardIsLink } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid justifyContent="center" container spacing={isMobile ? 1 : 3}>
      {cards.map((card, i) => {
        const cardElement = <ImageCardWithText image={card.image} cardText={card.text} />;

        return (
          <Grid item key={`ImageCardWithText-${i}`}>
            {cardIsLink ? (
              <LocalizedLink component={RouterLink} to={card.link}>
                {cardElement}
              </LocalizedLink>
            ) : (
              cardElement
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};
