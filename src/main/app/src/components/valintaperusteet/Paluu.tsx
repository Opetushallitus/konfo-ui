import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

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
        <MaterialIcon
          icon="arrow_back_ios"
          sx={{ display: 'inline-flex', fontSize: '12px' }}
        />
        {t('lomake.palaa-esittelyyn')}
      </Link>
    </Box>
  );
};
