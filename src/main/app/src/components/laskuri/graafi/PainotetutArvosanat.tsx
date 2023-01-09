import React from 'react';

import { Box, styled, Typography, List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { translate } from '#/src/tools/localization';
import { formatDouble } from '#/src/tools/utils';
import { PainotettuArvosana } from '#/src/types/HakukohdeTypes';

const StyledBox = styled(Box)(() => ({
  marginTop: '1rem',
}));

type Props = {
  painotetutArvosanat: Array<PainotettuArvosana>;
};

export const PainotetutArvosanat = ({ painotetutArvosanat }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledBox>
      <Typography variant="body1" sx={{ fontWeight: 600, margin: '1rem 0' }}>
        {t('pistelaskuri.graafi.painotettujaarvosanoja')}
      </Typography>
      <List dense={true} sx={{ listStyleType: 'disc', paddingLeft: '3rem' }}>
        {painotetutArvosanat.map((painotettu: PainotettuArvosana, index: number) => (
          <ListItem key={`painotettu-${index}`} sx={{ display: 'list-item' }}>
            {`${translate(painotettu.koodit.oppiaine.nimi)}, ${t(
              'pistelaskuri.graafi.painokerroin'
            )}: ${formatDouble(painotettu.painokerroin)}`}
          </ListItem>
        ))}
      </List>
    </StyledBox>
  );
};
