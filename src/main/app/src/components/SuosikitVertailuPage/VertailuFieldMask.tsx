import { Box, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { KonfoCheckbox } from '#/src/components/common/KonfoCheckbox';
import { Heading } from '#/src/components/Heading';
import { useVertailuSuosikit } from '#/src/hooks/useSuosikitSelection';

import { useSuosikitVertailuData } from './useSuosikitVertailuData';
import { SuosikitVertailuMask, useSuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VERTAILU_FIELDS_ORDER } from './VERTAILU_FIELDS_ORDER';

const VertailuFieldCheckbox = ({ fieldId }: { fieldId: keyof SuosikitVertailuMask }) => {
  const { t } = useTranslation();
  const { mask, setMask } = useSuosikitVertailuMask();

  const oids = useVertailuSuosikit();
  const { data } = useSuosikitVertailuData(oids);
  // Oletetaan, että vuosi on sama kaikille vertailtaville, koska vertailussa on vain
  // Perusopetuksen jälkeisen yhteishaun hakukohteita, ja julkaistuna on kerrallaan vain yksi
  // Perusopetuksen jälkeisen yhteishaun haku-entiteetti.
  const year = data?.[0]?.edellinenHaku?.vuosi;

  return (
    <FormControlLabel
      label={t(`suosikit-vertailu.${fieldId}`, {
        year,
      })}
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
      margin={2}>
      <Heading variant="h5">{t('suosikit-vertailu.valitse-vertailtavat-tiedot')}</Heading>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {VERTAILU_FIELDS_ORDER.map(({ fieldId }) => (
          <VertailuFieldCheckbox key={fieldId} fieldId={fieldId} />
        ))}
      </Box>
    </Box>
  );
};
