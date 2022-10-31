import React from 'react';

import { Box, Typography } from '@mui/material';

import { HakupisteLaskelma } from './Keskiarvo';

type Props = {
  tulos: HakupisteLaskelma;
};

export const KeskiarvoTulos = ({ tulos }: Props) => {
  return (
    <Box>
      <Box>
        <Typography variant="h3">Lukuaineiden keskiarvo lukioon hakua varten</Typography>
        {tulos.keskiarvo}
      </Box>
      <Box>
        <Typography variant="h3">Ammatillisen koulutuksen hakupisteet</Typography>
        {tulos.pisteet + 2}
        <br />
        {tulos.pisteet}
      </Box>
    </Box>
  );
};
