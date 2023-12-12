import {
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_OPTIONS } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { styled } from '#/src/theme';

const StyledLangNavList = styled(List)({
  padding: '20px 0',
  maxWidth: '150px',
});

export const MobileLanguageSelection = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();

  const handleChange = (langCode: string) => {
    setLanguage?.(langCode);
  };

  return (
    <StyledLangNavList
      aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
      dense>
      {LANG_OPTIONS.map((langOption) => (
        <ListItem key={langOption.code}>
          <ListItemButton
            sx={{
              paddingLeft: 0,
              color: colors.brandGreen,
              '&.Mui-disabled': {
                opacity: 1,
                color: colors.green900,
              },
            }}
            disabled={isEqual(langOption.code, language)}
            onClick={() => handleChange(langOption.code)}
            role="link"
            lang={langOption.ISOCode}
            aria-label={t(`kielivalinta.${langOption.code}`)}>
            <ListItemIcon>
              {isEqual(language, langOption.code) && (
                <MaterialIcon sx={{ color: colors.green900 }} icon="check" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={t(`kielivalinta.header.${langOption.code}`)}
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
