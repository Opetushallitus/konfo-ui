import { Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { Kielivalikoima } from '#/src/types/ToteutusTypes';

export const VertailuKielet = ({
  kielivalikoima,
}: {
  kielivalikoima: Kielivalikoima;
}) => {
  const { t } = useTranslation();
  return isEmpty(kielivalikoima) ? null : (
    <Box>
      {Object.entries(kielivalikoima ?? {})?.map(([kieliKey, kieliValue]) =>
        isEmpty(kieliValue) ? null : (
          <Box key={kieliKey} display="flex" gap={1}>
            <Box flexShrink={0}>{t(`toteutus.${kieliKey}`)}: </Box>
            <Box>{kieliValue?.map((kieli) => localize(kieli)).join(', ')}</Box>
          </Box>
        )
      )}
    </Box>
  );
};
