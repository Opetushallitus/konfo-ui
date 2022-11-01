import React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LanguageIcon from '@mui/icons-material/Language';
import { FormControl, Select, MenuItem, InputBase, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LANG_NAME_BY_CODE } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { supportedLanguages } from '#/src/tools/i18n';

const PREFIX = 'LanguageDropDown';

const classes = {
  input: `${PREFIX}-input`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.input}`]: {
    position: 'relative',
    fontSize: 'small',
    color: colors.white,
    padding: '5px 5px 5px 5px',
  },
}));

const CustomInput = InputBase;

const iconComponent = (props) => {
  return (
    <ArrowDropDownIcon className={props.className} style={{ color: colors.white }} />
  );
};

const LanguageDropDown = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useLanguageState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    let selectedLanguage = event.target.value;
    Cookies.set('lang', selectedLanguage, {
      expires: 1800,
      path: '/',
    });
    setLanguage(selectedLanguage);
  };
  return (
    <StyledBox display="flex" flexDirection="column" alignItems="center">
      <LanguageIcon
        onClick={open ? handleClose : handleOpen}
        style={{ cursor: 'pointer' }}
      />
      <FormControl size="small" color="primary">
        <Select
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          }}
          value={language}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          onChange={handleChange}
          variant="standard"
          renderValue={(value) => value.toUpperCase()}
          input={
            <CustomInput
              classes={{
                input: classes.input,
              }}
            />
          }
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
    </StyledBox>
  );
};

export default LanguageDropDown;
