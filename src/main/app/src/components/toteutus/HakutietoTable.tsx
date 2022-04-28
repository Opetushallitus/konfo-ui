import React from 'react';

import { Grid, GridSize, Typography, makeStyles } from '@material-ui/core';
import _ from 'lodash';

import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Translateable } from '#/src/types/common';

export type HakutietoCellSpec = {
  size?: GridSize;
  heading: string;
  content: Array<string>;
  modalText?: Translateable;
};

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: 700,
  },
}));

export const HakutietoTable = ({
  items,
}: {
  items: Array<HakutietoCellSpec | undefined>;
}) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" spacing={3}>
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
              {!_.isEmpty(modalText) && (
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
    </Grid>
  );
};
