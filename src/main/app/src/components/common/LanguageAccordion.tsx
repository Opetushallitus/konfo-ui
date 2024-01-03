import { useState } from 'react';

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
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_OPTIONS } from '#/src/constants';
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

const StyledAccordionDetails = styled(AccordionDetails)({
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

const LANG_ACCORDION_CONTENT_ID = 'language-accordion-content';

export const LanguageAccordion = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();
  const [isOpen, setOpen] = useState(false);

  const handleChange = (langCode: string) => {
    setOpen(false);
    setLanguage?.(langCode);
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <StyledAccordion disableGutters expanded={isOpen}>
      <StyledAccordionSummary
        aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
        aria-expanded={isOpen}
        aria-controls={LANG_ACCORDION_CONTENT_ID}
        role="button"
        expandIcon={<MaterialIcon icon="expand_more" sx={{ color: colors.white }} />}
        onClick={() => setOpen(!isOpen)}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <MaterialIcon icon="language" sx={{ cursor: 'pointer', marginRight: '9px' }} />
          <Typography sx={{ color: colors.white, border: 'none' }} aria-hidden={true}>
            {t(`kielivalinta.header.${language}`)}
          </Typography>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails id={LANG_ACCORDION_CONTENT_ID}>
        <List aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}>
          {LANG_OPTIONS.filter(({ code }) => !isEqual(language, code)).map(
            (langOption) => (
              <ListItem
                key={langOption.code}
                sx={{ padding: 0 }}
                lang={langOption.ISOCode}>
                <StyledListItemButton
                  lang={langOption.ISOCode}
                  disabled={isEqual(langOption.code, language)}
                  onClick={() => handleChange(langOption.code)}
                  role="link"
                  aria-label={t(`kielivalinta.${langOption.code}`)}>
                  <ListItemText
                    lang={langOption.ISOCode}
                    primary={t(`kielivalinta.header.${langOption.code}`)}
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
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
