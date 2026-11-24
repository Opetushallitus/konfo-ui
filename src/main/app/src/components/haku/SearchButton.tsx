import { IconButton, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

// Hakulaatikko (SearchBox) tyylittelee painikkeen tällä luokalla
export const SEARCH_BUTTON_CLASS = 'search-button';

// Isoilla näytöillä tekstillinen painike, kapeilla pelkkä suurennuslasi
export const SearchButton = ({
  isKeywordValid,
  mdUp,
}: {
  isKeywordValid: boolean;
  mdUp: boolean;
}) => {
  const { t } = useTranslation();

  return mdUp ? (
    <Button
      className={SEARCH_BUTTON_CLASS}
      startIcon={<MaterialIcon icon="search" />}
      disabled={!isKeywordValid}
      type="submit"
      variant="contained"
      sx={{ flexShrink: 0 }}>
      {t('haku.etsi')}
    </Button>
  ) : (
    <IconButton
      className={SEARCH_BUTTON_CLASS}
      disabled={!isKeywordValid}
      type="submit"
      aria-label={t('haku.etsi')}>
      <MaterialIcon icon="search" />
    </IconButton>
  );
};
