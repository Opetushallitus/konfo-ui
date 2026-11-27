import {
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { isEqual } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_OPTIONS } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';

export const MobileLanguageSelection = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();

  const handleChange = (langCode: string) => {
    setLanguage?.(langCode);
  };

  return (
    // Tyylit määritelty tässä, koska sivuvalikko käyttää oph-design-systemin teemaa, josta
    // puuttuvat Konfon teeman List-komponenttien ylikirjoitukset
    <List
      aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
      dense
      disablePadding>
      {LANG_OPTIONS.map((langOption) => (
        <ListItem
          key={langOption.code}
          sx={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: '4px' }}>
          <ListItemButton
            sx={{
              paddingLeft: 0,
              color: colors.brandGreen,
              '&:hover': {
                backgroundColor: 'transparent',
              },
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
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isEqual(language, langOption.code) && (
                <MaterialIcon sx={{ color: colors.green900 }} icon="check" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={t(`kielivalinta.header.${langOption.code}`)}
              slotProps={{
                // OPH-teeman typografialla on oma värinsä, joten peritään väri napista
                primary: { fontWeight: 'bolder', width: '100%', color: 'inherit' },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
