import React from 'react';

import { Grid, GridSize, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isEmpty } from 'lodash';

import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Translateable } from '#/src/types/common';

const PREFIX = 'HakutietoTable';

const classes = {
  gridHeading: `${PREFIX}-gridHeading`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.gridHeading}`]: {
    ...theme.typography.body1,
    fontWeight: 700,
  },
}));

export type HakutietoCellSpec = {
  size?: GridSize;
  heading: string;
  content: Array<string>;
  modalText?: Translateable;
};

export const HakutietoTable = ({
  items,
}: {
  items: Array<HakutietoCellSpec | undefined>;
}) => {
  return (
    <StyledGrid container direction="row" spacing={3}>
      {items
        .filter((x): x is HakutietoCellSpec => Boolean(x))
        .map(({ size, heading, content, modalText }) => (
          <Grid key={heading} item xs={size}>
            <Grid item container spacing={1} wrap="nowrap" alignItems="flex-start">
              <Grid item>
                <Typography className={classes.gridHeading} noWrap>
                  {heading}
                </Typography>
              </Grid>
              {!isEmpty(modalText) && (
                <Grid item>
                  <LabelTooltip title={<LocalizedHTML noMargin data={modalText} />} />
                </Grid>
              )}
            </Grid>
            <Grid item>
              {content.map((v: string, i: number) => (
                <Typography key={`${heading}-text-${i}`} variant="body1">
                  {v}
                </Typography>
              ))}
            </Grid>
          </Grid>
        ))}
    </StyledGrid>
  );
};
