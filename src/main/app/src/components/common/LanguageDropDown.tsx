import { useState } from 'react';

import LanguageIcon from '@mui/icons-material/Language';
import { Select, MenuItem, InputBase, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { LANG_NAME_BY_CODE } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { supportedLanguages } from '#/src/tools/i18n';

const CustomInput = styled(InputBase)({
  color: 'white',
  fontSize: 'small',

  // Roll focus indicator back to browser UA stylesheet values
  div: {
    ':focus-visible': {
      outlineColor: '-webkit-focus-ring-color',
      outlineStyle: 'auto',
      outlineWidth: 'thin',
      outline: 'revert',
    },
  },
});

export const LanguageDropDown = () => {
  const { t } = useTranslation();
  const [language, setLanguage]: any = useLanguageState();
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any) => {
    const selectedLanguage: string = event.target.value;
    Cookies.set('lang', selectedLanguage, {
      expires: 1800,
      path: '/',
    });
    setLanguage?.(selectedLanguage);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LanguageIcon
        onClick={isOpen ? handleClose : handleOpen}
        sx={{ cursor: 'pointer', marginRight: '9px' }}
      />
      <Select
        sx={{
          '& .MuiSelect-icon': {
            fill: 'white',
          },
        }}
        MenuProps={{
          disableScrollLock: true,
        }}
        value={language}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
        renderValue={(value) => value?.toUpperCase()}
        input={<CustomInput aria-label={t('opintopolku.valitsekieli')} />}>
        {supportedLanguages.map((langCode) => (
          <MenuItem key={langCode} value={langCode}>
            {t(`kielivalinta.${(LANG_NAME_BY_CODE as any)[langCode]}`)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
