import React from 'react';

import { Box, Dialog, styled, Typography } from '@mui/material';

import { KeskiarvoLaskuri } from './KeskiarvoLaskuri';

const PREFIX = 'KeskiarvoModal__';

const classNames = {
  container: `${PREFIX}container`,
};

const StyledDialog = styled(Dialog)(() => ({
  [`.${classNames.container}`]: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
  },
}));

type Props = {
  open: boolean;
  closeFn: () => void;
};

export const KeskiArvoModal = ({ open = false, closeFn }: Props) => {
  return (
    <StyledDialog open={open} onClose={closeFn}>
      <Box className={classNames.container}>
        <Typography variant="h2">Hakupistelaskuri</Typography>
        <Typography>
          Arvioi peruskoulun päättötodistuksen keskiarvosi tai syötä kaikkien oppiaineiden
          arvosanat. Laskuri laskee hakupisteesi yhteishakua varten uusimpien
          valintaperusteiden mukaan.
        </Typography>
        <KeskiarvoLaskuri></KeskiarvoLaskuri>
      </Box>
    </StyledDialog>
  );
};
