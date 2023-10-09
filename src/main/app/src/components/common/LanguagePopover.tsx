import React, { useState } from 'react';

import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import {
  Box,
  Backdrop,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_NAME_Code_ISOCode } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { styled } from '#/src/theme';

const StyledButton = styled(Button)({
  color: 'white',
  textTransform: 'uppercase',
  padding: '2px 5px',
  fontWeight: 550,
});

export const LanguagePopover = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();
  const [isOpen, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const canBeOpen = isOpen && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popover' : undefined;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(e.currentTarget);
  };
  const handleChange = (langCode: string) => {
    Cookies.set('lang', langCode, {
      expires: 1800,
      path: '/',
    });
    setLanguage?.(langCode);
    setOpen(false);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <MaterialIcon
        icon="language"
        onClick={() => setOpen(true)}
        sx={{ cursor: 'pointer', marginRight: '9px' }}
      />
      <StyledButton
        aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
        size="small"
        aria-describedby={id}
        disableRipple
        endIcon={isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
        onClick={handleClick}>
        {t(`kielivalinta.header.${language}`)}
      </StyledButton>
      <Backdrop open={isOpen}>
        <Popover
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={id}
          open={isOpen}
          anchorEl={anchorEl}>
          <Paper>
            <List>
              {LANG_NAME_Code_ISOCode.map((langCode) => (
                <ListItem key={langCode.code} disablePadding>
                  <ListItemButton
                    onClick={() => handleChange(langCode.code)}
                    role="link"
                    lang={langCode.ISOCode}
                    aria-hidden={true}
                    aria-label={t(`kielivalinta.${langCode.code}`)}>
                    <ListItemText primary={t(`kielivalinta.header.${langCode.code}`)} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popover>
      </Backdrop>
    </Box>
  );
};
