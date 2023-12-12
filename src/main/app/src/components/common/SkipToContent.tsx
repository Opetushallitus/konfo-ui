import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const SkipLink = styled(Link)({
  position: 'absolute',
  left: '-9999px',
  zIndex: '999',
  opacity: '0',

  '&.Mui-focusVisible': {
    color: colors.grey900,
    background: colors.green100,
    height: '30px',
    left: '50%',
    textAlign: 'center',
    padding: '8px',
    paddingBottom: '30px',
    zIndex: '100000',
    opacity: '1',
  },
});

export const SkipToContent = () => {
  const { t } = useTranslation();
  return <SkipLink href="#app-main-content">{t('siirry-sisaltoon')}</SkipLink>;
};
