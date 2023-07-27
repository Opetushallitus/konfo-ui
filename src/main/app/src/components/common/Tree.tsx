import React from 'react';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import TreeImage from '#/src/assets/images/ammatillinen_koulutus_puu.svg'; //TODO: This should probably be a prop
import { ContentfulLehti } from '#/src/types/ContentfulTypes';

import { LinkCardGrid } from './LinkCardGrid';
import { Spacer } from './Spacer';

const PREFIX = 'Tree';

const classes = {
  treeContainer: `${PREFIX}-treeContainer`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.treeContainer}`]: {
    [theme.breakpoints.up('lg')]: {
      backgroundImage: `url(${TreeImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backGroundSize: 'cover',
      height: '960px',
    },
  },
}));

export const Tree = ({
  id,
  title,
  cardsLeft,
  cardsRight,
}: {
  id: string;
  title: string;
  cardsLeft?: Array<ContentfulLehti>;
  cardsRight?: Array<ContentfulLehti>;
}) => {
  return (
    <StyledGrid container direction="column" alignItems="center">
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
    </StyledGrid>
  );
};
