import React from 'react';

import { Dialog, styled, Typography } from '@mui/material';

const StyledDialog = styled(Dialog)(() => ({
  padding: '1rem 2rem',
}));

type Props = {
  open: boolean;
  closeFn: () => void;
};

export const KeskiArvoModal = ({ open = false, closeFn }: Props) => {
  return (
    <StyledDialog open={open} onClose={closeFn}>
      <Typography variant="h2">Hakupistelaskuri</Typography>
      <Typography>
        Arvioi peruskoulun päättötodistuksen keskiarvosi tai syötä kaikkien oppiaineiden
        arvosanat. Laskuri laskee hakupisteesi yhteishakua varten uusimpien
        valintaperusteiden mukaan.
      </Typography>
    </StyledDialog>
  );
};
