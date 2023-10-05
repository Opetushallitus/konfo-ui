import { useState } from 'react';

import { Select, MenuItem, InputBase, Box } from '@mui/material';
import Cookies from 'js-cookie';
import { has } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LANG_NAME_Code_ISOCode } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { styled } from '#/src/theme';

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
  const handleClose = (e: React.SyntheticEvent) => {
    has(e.target, 'selected') && setOpen(false);
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
      <MaterialIcon
        icon="language"
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
        aria-label={t('kielivalinta.valitse-kieli-taman-sivun-kieli-on')}
        arria-hidden={true}
        value={t(`kielivalinta.header.${language}`)}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
        renderValue={(value) => value?.toUpperCase()}
        input={<CustomInput aria-label={t('opintopolku.valitsekieli')} />}>
        {LANG_NAME_Code_ISOCode.map((langCode) => (
          <MenuItem
            key={langCode.code}
            value={langCode.code}
            lang={langCode.ISOCode}
            aria-hidden={true}
            aria-label={t(`kielivalinta.${langCode.code}`)}>
            {t(`kielivalinta.header.${langCode.code}`)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
