import { ButtonGroup, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '#/src/components/common/Filter/CustomizedMuiComponents';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { useSearch } from '../hakutulosHooks';

const TabButton = styled(Button)({
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
});

export const MobileToggleKoulutusOppilaitos = () => {
  const { t } = useTranslation();
  const { selectedTab, setSelectedTab } = useSearch();

  function updateSelectedTab(e: React.SyntheticEvent<HTMLButtonElement>) {
    const newSelectedTab = e.currentTarget.dataset.tab;
    if (newSelectedTab === 'koulutus' || newSelectedTab === 'oppilaitos') {
      setSelectedTab(newSelectedTab);
    }
  }

  return (
    <SuodatinAccordion style={{ boxShadow: 'none' }} defaultExpanded elevation={0}>
      <SuodatinAccordionSummary expandIcon={<MaterialIcon icon="expand_more" />}>
        <Typography variant="subtitle1" component="span">
          {t('haku.kategoria')}
        </Typography>
      </SuodatinAccordionSummary>
      <SuodatinAccordionDetails>
        <ButtonGroup fullWidth>
          <TabButton
            data-tab="koulutus"
            variant={selectedTab === 'koulutus' ? 'contained' : 'outlined'}
            onClick={updateSelectedTab}>
            {t('haku.koulutukset')}
          </TabButton>
          <TabButton
            data-tab="oppilaitos"
            variant={selectedTab === 'oppilaitos' ? 'contained' : 'outlined'}
            onClick={updateSelectedTab}>
            {t('haku.oppilaitokset')}
          </TabButton>
        </ButtonGroup>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
