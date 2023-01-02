import React, { useState, useEffect } from 'react';

import { Box, styled, Typography, Button, List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { formatDouble } from '#/src/tools/utils';

import { Kouluaine } from '../aine/Kouluaine';

const StyledBox = styled(Box)(() => ({
  marginTop: '1rem',
  background: `${colors.white} 0% 0% no-repeat padding-box`,
  boxShadow: 'inset -2px -2px 7px #0000001A',
  borderRadius: '2px',
  padding: '20px',
  textAlign: 'center',
}));

type Props = {
  painotetutArvosanat: Array<Kouluaine>;
};

export const PainotetutArvosanat = ({ painotetutArvosanat }: Props) => {
  const { t } = useTranslation();
  const [showPainotetut, setShowPainotetut] = useState(false);

  useEffect(() => {
    if (painotetutArvosanat.length < 1) {
      setShowPainotetut(false);
    }
  }, [painotetutArvosanat]);

  return (
    <StyledBox>
      <Typography variant="body1" sx={{ fontWeight: 600, margin: '1rem 0' }}>
        Hakukohteella on painotettuja arvosanoja
      </Typography>
      {painotetutArvosanat.length > 0 && (
        <Button onClick={() => setShowPainotetut(!showPainotetut)}>
          {showPainotetut
            ? 'Piilota antamasi kouluaineet joihin vaikuttaa painokerroin'
            : 'Näytä antamasi kouluaineet joihin vaikuttaa painokerroin'}
        </Button>
      )}
      {showPainotetut && (
        <List>
          {painotetutArvosanat.map((painotettu: Kouluaine, index: number) => (
            <ListItem key={`painotettu-${index}`}>{`Aine: ${t(
              painotettu.nimi
            )}, painokerroin: ${formatDouble(painotettu.painokerroin)}`}</ListItem>
          ))}
        </List>
      )}
    </StyledBox>
  );
};
