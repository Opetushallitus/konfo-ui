import React from 'react';

import { ExpandMore } from '@mui/icons-material';
import { ButtonGroup, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '#/src/components/common/Filter/CustomizedMuiComponents';

import { useSearch } from '../hakutulosHooks';

const PREFIX = 'MobileToggleKoulutusOppilaitos';

const classes = {
  buttonActive: `${PREFIX}-buttonActive`,
  buttonInactive: `${PREFIX}-buttonInactive`,
};

const StyledSuodatinAccordion = styled(SuodatinAccordion)(() => ({
  [`& .${classes.buttonActive}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },

  [`& .${classes.buttonInactive}`]: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleKoulutusOppilaitos = () => {
  const { t } = useTranslation();
  const { selectedTab, setSelectedTab } = useSearch();

  function updateSelectedTab(e) {
    const newSelectedTab = e.currentTarget.dataset.tab;
    setSelectedTab(newSelectedTab);
  }

  return (
    <StyledSuodatinAccordion style={{ boxShadow: 'none' }} defaultExpanded elevation={0}>
      <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.kategoria')}</Typography>
      </SuodatinAccordionSummary>
      <SuodatinAccordionDetails>
        <ButtonGroup fullWidth>
          <Button
            data-tab="koulutus"
            className={
              selectedTab === 'koulutus' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={updateSelectedTab}>
            {t('haku.koulutukset')}
          </Button>
          <Button
            data-tab="oppilaitos"
            className={
              selectedTab === 'oppilaitos' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={updateSelectedTab}>
            {t('haku.oppilaitokset')}
          </Button>
        </ButtonGroup>
      </SuodatinAccordionDetails>
    </StyledSuodatinAccordion>
  );
};

export default MobileToggleKoulutusOppilaitos;