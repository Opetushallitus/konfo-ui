import { useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  Box,
  ListItemText,
  AccordionSummary,
  AccordionDetails,
  Typography,
  MenuList,
  MenuItem,
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
  minWidth: '170px',
});

const StyledAccordionSummary = styled(AccordionSummary)({
  color: colors.white,
});

const StyledAccordionDetials = styled(AccordionDetails)({
  padding: '10px 0 10px',
});

const StyledMenuItem = styled(MenuItem)({
  padding: '10px 0',
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
  };

  return (
    <StyledAccordion
      aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
      aria-expanded={isOpen}
      disableGutters
      expanded={isOpen}
      elevation={0}>
      <StyledAccordionSummary
        aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
        aria-hidden={true}
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
        <MenuList
          role="list"
          aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}>
          {LANG_NAME_Code_ISOCode.filter(({ code }) => !isEqual(language, code)).map(
            (langCode) => (
              <StyledMenuItem
                key={langCode.code}
                aria-label={t(`kielivalinta.${langCode.code}`)}
                lang={langCode.ISOCode}
                role="link"
                onClick={() => handleChange(langCode.code)}>
                <ListItemText
                  aria-hidden={true}
                  primary={t(`kielivalinta.header.${langCode.code}`)}
                  primaryTypographyProps={{
                    color: colors.white,
                    padding: '5px 34px 5px',
                  }}
                />
              </StyledMenuItem>
            )
          )}
        </MenuList>
      </StyledAccordionDetials>
    </StyledAccordion>
  );
};
