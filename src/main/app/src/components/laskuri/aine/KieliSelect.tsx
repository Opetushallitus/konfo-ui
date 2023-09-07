import React from 'react';

import {
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Input,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';
import { translate } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

import { Kieliaine } from './Kouluaine';
import { useKieliKoodit } from '../hooks';

const PREFIX = 'keskiarvo__ainelaskuri__kieli';

const classes = {
  input: `${PREFIX}input`,
  optionDisabled: `${PREFIX}option--disabled`,
  langLabel: `${PREFIX}langlabel`,
  langLabelContainer: `${PREFIX}langlabelcontainer`,
};

const KieliSelectControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: '0.5rem',
  columnGap: '2px',
  [theme.breakpoints.down('sm')]: {
    alignItems: 'stretch',
    width: '100%',
  },
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    marginTop: 0,
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
    width: '12rem',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      marginRight: '2.7rem',
      width: 'auto',
    },
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
  [`& .${classes.langLabel}`]: {
    overflow: 'unset',
    textOverflow: 'unset',
    overflowWrap: 'normal',
    whiteSpace: 'break-spaces',
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'normal',
    maxWidth: '12rem',
    lineHeight: '1.6rem',
  },
}));

type Props = {
  aine: Kieliaine;
  updateKieli: (koodiUri: string) => void;
};

export const KieliSelect = ({ aine, updateKieli }: Props) => {
  const { t } = useTranslation();
  const data = useKieliKoodit();

  const handleKieliChange = (event: SelectChangeEvent) => {
    updateKieli(event.target.value);
  };

  return (
    <KieliSelectControl variant="standard">
      <InputLabel className={classes.langLabel}>
        {t('pistelaskuri.aine.kielennimi')}
      </InputLabel>
      {data !== undefined && (
        <Select
          value={String(aine.kieliKoodi || null)}
          onChange={handleKieliChange}
          input={<Input className={classes.input} />}
          className={aine.kieliKoodi == null ? `${classes.optionDisabled}` : ''}
          variant="standard"
          disableUnderline={true}>
          <MenuItem key="kieli-null" disabled={true} value="null">
            {t('pistelaskuri.aine.valitsekieli')}
          </MenuItem>
          {data.map((kieli: Koodi, index: number) => (
            <MenuItem key={`kieli-${index}`} value={kieli.koodiUri}>
              {translate(kieli.nimi)}
            </MenuItem>
          ))}
        </Select>
      )}
    </KieliSelectControl>
  );
};
