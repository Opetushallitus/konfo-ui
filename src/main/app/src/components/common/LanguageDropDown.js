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
    fontSize: 'small',
    color: colors.white,
    padding: '5px 5px 5px 5px',
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
      <LanguageIcon />
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
            <MenuItem
              key={langCode}
              value={langCode}
              style={{
                fontSize: 'small',
                color: colors.black,
                backgroundColor: colors.white,
                margin: '10px 10px 10px 10px',
              }}>
              {t(`kielivalinta.${LANG_NAME_BY_CODE[langCode]}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageDropDown;
