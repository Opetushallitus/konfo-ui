import React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { toId } from '#/src/tools/utils';

export const StartComponent = ({
  ohjaavaHakuTitle,
  setStartOfQuestionnaire,
}: {
  ohjaavaHakuTitle: string;
  setStartOfQuestionnaire: (val: boolean) => void;
}) => {
  const { t } = useTranslation();

  const { clearRajainValues } = useSearch();

  const startQuestionnaire = () => {
    setStartOfQuestionnaire(false);
    clearRajainValues();
  };

  return (
    <Box>
      <HeadingBoundary>
        <Heading
          id={toId(ohjaavaHakuTitle)}
          variant="h2"
          sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          {ohjaavaHakuTitle}
        </Heading>
      </HeadingBoundary>
      <Typography sx={{ marginBottom: '1.5rem' }}>
        {t('ohjaava-haku.info-text')}
      </Typography>
      <Button
        onClick={startQuestionnaire}
        variant="contained"
        color="primary"
        sx={{ marginBottom: '30%' }}>
        {t('ohjaava-haku.aloita-kysely')}
      </Button>
    </Box>
  );
};
