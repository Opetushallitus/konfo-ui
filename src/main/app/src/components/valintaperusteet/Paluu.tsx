import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialSymbol } from '#/src/components/common/MaterialSymbol';

type Props = {
  paluuLinkki: string;
};

export const Paluu = ({ paluuLinkki }: Props) => {
  const { t } = useTranslation();
  return (
    <Box paddingTop="10px" paddingBottom="10px">
      <Link
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        href={paluuLinkki}>
        <MaterialSymbol
          icon="arrow_back_ios"
          sx={{ display: 'inline-flex', fontSize: '12px' }}
        />
        {t('lomake.palaa-esittelyyn')}
      </Link>
    </Box>
  );
};
