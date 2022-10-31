import React, { useState } from 'react';

import { Box, Typography, TextField } from '@mui/material';

import { Keskiarvot } from './Keskiarvo';

type Props = {
  updateKeskiarvoToCalculate: (keskiarvo: Keskiarvot) => void;
};

export const KeskiarvoLaskuri = ({ updateKeskiarvoToCalculate }: Props) => {
  const [keskiarvot, setKeskiarvot] = useState<Keskiarvot>({
    lukuaineet: '',
    taideTaitoAineet: '',
    kaikki: '',
  });

  const changeKeskiarvoLuku = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newKeskiArvo = { ...keskiarvot };
    newKeskiArvo.lukuaineet = event.target.value;
    setKeskiarvot(newKeskiArvo);
    updateKeskiarvoToCalculate(newKeskiArvo);
  };

  const changeKeskiarvoTaide = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newKeskiArvo = { ...keskiarvot };
    newKeskiArvo.taideTaitoAineet = event.target.value;
    setKeskiarvot(newKeskiArvo);
    updateKeskiarvoToCalculate(newKeskiArvo);
  };

  const changeKeskiarvoKaikki = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newKeskiArvo = { ...keskiarvot };
    newKeskiArvo.kaikki = event.target.value;
    setKeskiarvot(newKeskiArvo);
    updateKeskiarvoToCalculate(newKeskiArvo);
  };

  return (
    <Box>
      <Typography variant="h3">Peruskoulun keskiarvot</Typography>
      <Typography>
        Jos haluat tarkan laskelman, kerro oppiaineiden arvosanat yksitellen.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <TextField
          inputProps={{ inputMode: 'numeric' }}
          onChange={changeKeskiarvoLuku}
          value={keskiarvot.lukuaineet}
          label="Lukuaineiden keskiarvo *"></TextField>
        <TextField
          inputProps={{ inputMode: 'numeric' }}
          onChange={changeKeskiarvoTaide}
          value={keskiarvot.taideTaitoAineet}
          label="Taide- ja taitoaineiden keskiarvo *"></TextField>
        <TextField
          inputProps={{ inputMode: 'numeric' }}
          onChange={changeKeskiarvoKaikki}
          value={keskiarvot.kaikki}
          label="Kaikkien aineiden keskiarvo *"></TextField>
      </Box>
    </Box>
  );
};
