import { GridSize, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { isEmpty } from 'lodash';

import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { isTruthy } from '#/src/tools/utils';
import { withDefaultProps } from '#/src/tools/withDefaultProps';
import { Translateable } from '#/src/types/common';

export type HakutietoCellSpec = {
  size?: GridSize;
  heading: string;
  content: Array<string>;
  modalText?: Translateable;
};

const HakutietoHeading = withDefaultProps(Typography, {
  variant: 'body1',
  fontWeight: 700,
  noWrap: true,
});

export const HakutietoTable = ({
  items,
}: {
  items: Array<HakutietoCellSpec | undefined | false>;
}) => {
  return (
    <Grid container direction="row" spacing={3}>
      {items.filter(isTruthy).map(({ size, heading, content, modalText }) => (
        <Grid key={heading} size={{ xs: size }}>
          <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
            <Grid>
              <HakutietoHeading>{heading}</HakutietoHeading>
            </Grid>
            {!isEmpty(modalText) && (
              <Grid>
                <LabelTooltip title={<LocalizedHTML noMargin data={modalText} />} />
              </Grid>
            )}
          </Grid>
          <Grid>
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
