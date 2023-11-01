import { useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  Box,
  ListItemText,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItem,
} from '@mui/material';
import Cookies from 'js-cookie';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_NAME_Code_ISOCode } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { styled } from '#/src/theme';

const StyledAccordion = styled(Accordion)({
  backgroundColor: colors.brandGreen,
  color: colors.white,
  position: 'absolute',
  right: '5px',
  top: '10px',
  minWidth: '170px',
  boxShadow: 'none',
  '&:before': {
    height: 0,
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  color: colors.white,
  '&.Mui-focusVisible': {
    outline: '1px solid white',
  },
  '&:hover': {
    outline: '1px solid white',
  },
});

const StyledAccordionDetials = styled(AccordionDetails)({
  padding: '10px 0 10px',
});

const StyledListItemButton = styled(ListItemButton)({
  margin: '0 3px',
  '&.Mui-focusVisible': {
    outline: '1px solid white',
  },
  '&:hover': {
    outline: '1px solid white',
  },
});

export const LanguageAccordion = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();
  const [isOpen, setOpen] = useState(false);

  const handleChange = (langCode: string) => {
    setOpen(false);
    Cookies.set('lang', langCode, {
      expires: 1800,
      path: '/',
    });
    setLanguage?.(langCode);
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <StyledAccordion aria-expanded={isOpen} disableGutters expanded={isOpen}>
      <StyledAccordionSummary
        aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
        role="button"
        expandIcon={<ExpandMore sx={{ color: colors.white }} />}
        onClick={() => setOpen(!isOpen)}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <MaterialIcon icon="language" sx={{ cursor: 'pointer', marginRight: '9px' }} />
          <Typography sx={{ color: colors.white, border: 'none' }} aria-hidden={true}>
            {t(`kielivalinta.header.${language}`)}
          </Typography>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetials>
        <List aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}>
          {LANG_NAME_Code_ISOCode.filter(({ code }) => !isEqual(language, code)).map(
            (langCode) => (
              <ListItem key={langCode.code} sx={{ padding: 0 }} lang={langCode.ISOCode}>
                <StyledListItemButton
                  lang={langCode.ISOCode}
                  disabled={isEqual(langCode.code, language)}
                  onClick={() => handleChange(langCode.code)}
                  role="link"
                  aria-label={t(`kielivalinta.${langCode.code}`)}>
                  <ListItemText
                    lang={langCode.ISOCode}
                    primary={t(`kielivalinta.header.${langCode.code}`)}
                    primaryTypographyProps={{
                      color: colors.white,
                      paddingLeft: '30px',
                    }}
                  />
                </StyledListItemButton>
              </ListItem>
            )
          )}
        </List>
      </StyledAccordionDetials>
    </StyledAccordion>
  );
};
