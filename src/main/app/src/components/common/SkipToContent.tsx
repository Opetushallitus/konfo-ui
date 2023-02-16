import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

const SkipLink = styled(Link)({
  position: 'absolute',
  left: '-9999px',
  zIndex: '999',
  opacity: '0',

  [`&.Mui-focusVisible`]: {
    color: colors.black,
    background: colors.lightGreenBg,
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
