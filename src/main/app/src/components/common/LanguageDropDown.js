import React from 'react';

import {
  FormControl,
  Select,
  MenuItem,
  withStyles,
  InputBase,
  Box,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LanguageIcon from '@material-ui/icons/Language';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LANG_NAME_BY_CODE } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { supportedLanguages } from '#/src/tools/i18n';

const CustomInput = withStyles((theme) => ({
  input: {
    position: 'relative',
    fontSize: 12,
    color: colors.white,
  },
}))(InputBase);

const iconComponent = (props) => {
  return (
    <ArrowDropDownIcon className={props.className} style={{ color: colors.white }} />
  );
};

const LanguageDropDown = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useLanguageState();
  const handleChange = (event) => {
    let selectedLanguage = event.target.value;
    Cookies.set('lang', selectedLanguage, {
      expires: 1800,
      path: '/',
    });
    setLanguage(selectedLanguage);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LanguageIcon style={{ fontSize: '20px' }} />
      <FormControl size="small" color="primary">
        <Select
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          value={language}
          onChange={handleChange}
          variant="standard"
          renderValue={(value) => value.toUpperCase()}
          input={<CustomInput />}
          IconComponent={iconComponent}>
          {supportedLanguages.map((langCode) => (
            <MenuItem key={langCode} value={langCode}>
              {t(`kielivalinta.${LANG_NAME_BY_CODE[langCode]}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageDropDown;
