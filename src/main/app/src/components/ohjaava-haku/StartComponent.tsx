import React from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { Heading } from '#/src/components/Heading';
import { StyledButton } from '#/src/components/ohjaava-haku/common/StyledButton';
import { toId } from '#/src/tools/utils';

import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';

export const StartComponent = ({ ohjaavaHakuTitle }: { ohjaavaHakuTitle: string }) => {
  const { t } = useTranslation();

  const { clearRajainValues } = useSearch();
  const setIsStartOfQuestionnaire = useOhjaavaHaku((s) => s.setIsStartOfQuestionnaire);

  const startQuestionnaire = () => {
    setIsStartOfQuestionnaire(false);
    clearRajainValues();
  };

  return (
    <Box>
      <Heading
        id={toId(ohjaavaHakuTitle)}
        variant="h2"
        sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        {ohjaavaHakuTitle}
      </Heading>
      <Typography sx={{ marginBottom: '1.5rem' }}>
        {t('ohjaava-haku.info-text')}
      </Typography>
      <StyledButton
        onClick={startQuestionnaire}
        variant="contained"
        color="primary"
        sx={{ marginBottom: '30%' }}>
        {t('ohjaava-haku.aloita-kysely')}
      </StyledButton>
    </Box>
  );
};
