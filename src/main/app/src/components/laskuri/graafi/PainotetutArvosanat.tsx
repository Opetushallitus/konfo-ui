import React, { useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, styled, Typography, List, ListItem, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { translate } from '#/src/tools/localization';
import { formatDouble } from '#/src/tools/utils';
import { PainotettuArvosana } from '#/src/types/HakukohdeTypes';

const MAX_ITEMS_TO_ALWAYS_SHOW = 5;

const StyledBox = styled(Box)(() => ({
  marginTop: '1rem',
  button: {
    margin: '0.5rem 0',
  },
}));

type Props = {
  painotetutArvosanat: Array<PainotettuArvosana>;
};

const PainotettuArvosanaList = ({ painotetutArvosanat }: Props) => {
  const { t } = useTranslation();
  return (
    <List dense={true} sx={{ listStyleType: 'disc', paddingLeft: '3rem' }}>
      {painotetutArvosanat.map((painotettu: PainotettuArvosana, index: number) => (
        <ListItem key={`painotettu-${index}`} sx={{ display: 'list-item' }}>
          {`${translate(painotettu.koodit.oppiaine.nimi)}, ${t(
            'pistelaskuri.graafi.painokerroin'
          )}: ${formatDouble(painotettu.painokerroin)}`}
        </ListItem>
      ))}
    </List>
  );
};

export const PainotetutArvosanat = ({ painotetutArvosanat }: Props) => {
  const [hideRest, setHideRest] = useState(true);
  const { t } = useTranslation();

  return (
    <StyledBox>
      <Typography variant="body1" sx={{ fontWeight: 600, margin: '1rem 0' }}>
        {t('pistelaskuri.graafi.painotettujaarvosanoja')}
      </Typography>
      <PainotettuArvosanaList
        painotetutArvosanat={painotetutArvosanat.slice(0, MAX_ITEMS_TO_ALWAYS_SHOW)}
      />
      {!hideRest && painotetutArvosanat.length > MAX_ITEMS_TO_ALWAYS_SHOW && (
        <PainotettuArvosanaList
          painotetutArvosanat={painotetutArvosanat.slice(MAX_ITEMS_TO_ALWAYS_SHOW)}
        />
      )}
      {painotetutArvosanat.length > MAX_ITEMS_TO_ALWAYS_SHOW && (
        <Button
          color="secondary"
          endIcon={hideRest ? <ExpandMore /> : <ExpandLess />}
          fullWidth
          onClick={() => setHideRest(!hideRest)}>
          {hideRest ? t('haku.näytä_lisää') : t('haku.näytä_vähemmän')}
        </Button>
      )}
    </StyledBox>
  );
};
