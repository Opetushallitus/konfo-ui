import { IconButton, Button, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { theme } from '#/src/theme';

import type { SearchBoxVariant } from './SearchBox';

export const SearchButton = ({
  isKeywordValid,
  variant = 'default',
}: {
  isKeywordValid: boolean;
  variant?: SearchBoxVariant;
}) => {
  const { t } = useTranslation();
  const isOph = variant === 'oph';

  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  // Kapeilla näytöillä molemmissa varianteissa pelkkä suurennuslasi-painike
  return mdUp ? (
    <Button
      startIcon={<MaterialIcon icon="search" />}
      disabled={!isKeywordValid}
      type="submit"
      variant="contained"
      sx={
        isOph
          ? // Kentän ulkopuolella: teeman oletustyylit, ei omia marginaaleja
            { flexShrink: 0 }
          : {
              display: 'inline-flex',
              flexShrink: 0,
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              marginLeft: theme.spacing(3),
              marginRight: theme.spacing(3),
              padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            }
      }>
      {t('haku.etsi')}
    </Button>
  ) : (
    <IconButton
      disabled={!isKeywordValid}
      type="submit"
      sx={isOph ? undefined : { marginRight: theme.spacing(1) }}
      aria-label={t('haku.etsi')}>
      <MaterialIcon icon="search" />
    </IconButton>
  );
};
