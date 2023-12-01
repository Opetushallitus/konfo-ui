import React from 'react';

import { Box, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SuosikitVertailuMask, useSuosikitVertailuMask } from './useSuosikitVertailuMask';
import { FIELDS_ORDER } from './vertailuFieldsOrder';
import { KonfoCheckbox } from '../common/KonfoCheckbox';
import { Heading } from '../Heading';

const VertailuFieldCheckbox = ({ fieldId }: { fieldId: keyof SuosikitVertailuMask }) => {
  const { t } = useTranslation();
  const { mask, setMask } = useSuosikitVertailuMask();

  return (
    <FormControlLabel
      label={t(`suosikit-vertailu.${fieldId}`)}
      control={
        <KonfoCheckbox
          onClick={() => setMask({ [fieldId]: !mask[fieldId] })}
          checked={mask[fieldId]}
        />
      }
    />
  );
};

export const VertailuFieldMask = () => {
  const { t } = useTranslation();
  return (
    <Box
      flexDirection="column"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      width="100%"
      m={2}>
      <Heading variant="h5">{t('suosikit-vertailu.valitse-vertailtavat-tiedot')}</Heading>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {FIELDS_ORDER.map(({ fieldId }) => (
          <VertailuFieldCheckbox key={fieldId} fieldId={fieldId} />
        ))}
      </Box>
    </Box>
  );
};
