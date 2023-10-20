import {
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import Cookies from 'js-cookie';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_NAME_Code_ISOCode } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { styled } from '#/src/theme';

const StyledLangNavList = styled(List)<{ component?: React.ElementType }>({
  padding: '20px 0',
  maxWidth: '150px',
});

export const MobileLanguageSelection = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();

  const handleChange = (langCode: string) => {
    Cookies.set('lang', langCode, {
      expires: 1800,
      path: '/',
    });
    setLanguage?.(langCode);
  };

  return (
    <StyledLangNavList component="menu" aria-hidden={true} dense>
      {LANG_NAME_Code_ISOCode.map((langCode) => (
        <ListItem key={langCode.code}>
          <ListItemButton
            sx={{
              paddingLeft: 0,
              color: colors.brandGreen,
              '&.Mui-disabled': {
                opacity: 1,
                color: colors.darkGreen,
              },
            }}
            disabled={isEqual(langCode.code, language)}
            onClick={() => handleChange(langCode.code)}
            role="link"
            lang={langCode.ISOCode}
            aria-label={t(`kielivalinta.${langCode.code}`)}>
            <ListItemIcon>
              {isEqual(language, langCode.code) && (
                <MaterialIcon sx={{ color: colors.darkGreen }} icon="check" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={t(`kielivalinta.header.${langCode.code}`)}
              primaryTypographyProps={{
                fontWeight: 'bolder',
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </StyledLangNavList>
  );
};
