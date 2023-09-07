import React from 'react';

import {
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Input,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { ARVOSANA_VALUES } from './Kouluaine';

const PREFIX = 'keskiarvo__ainelaskuri__valinnainen__';

const classes = {
  input: `${PREFIX}input`,
  optionDisabled: `${PREFIX}option--disabled`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeSelect: `${PREFIX}gradeselect`,
  gradeDelete: `${PREFIX}gradeDelete`,
};

const ValinnainenControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: '0.5rem',
  [`& .${classes.gradeLabel}`]: {
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'normal',
    lineHeight: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'stretch',
      width: '100%',
    },
  },
  [`& .${classes.gradeDelete}`]: {
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem 0.5rem 0.6rem',
    alignSelf: 'end',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
  [`& .${classes.gradeSelect}`]: {
    margin: '0',
  },
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    maxWidth: '100%',
    width: '11rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
    [theme.breakpoints.down('lg')]: {
      width: '6rem',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
}));

const SelectContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
}));

type Props = {
  labelId: string;
  index: number;
  arvosana: number | null;
  updateValinnainenArvosana: (event: SelectChangeEvent) => void;
  removeValinnaisaine: () => void;
};

export const ValinnainenArvosana = ({
  labelId,
  index,
  arvosana,
  updateValinnainenArvosana,
  removeValinnaisaine,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ValinnainenControl variant="standard" sx={{ minWidth: 220 }}>
      <InputLabel id={`${labelId}-${index}`} className={classes.gradeLabel}>
        {t('pistelaskuri.aine.valinnaisaine')}
        <SelectContainer>
          <Select
            labelId={`${labelId}-${index}`}
            value={String(arvosana)}
            onChange={updateValinnainenArvosana}
            input={<Input className={classes.input} />}
            className={
              String(arvosana) === 'null'
                ? `${classes.optionDisabled} ${classes.gradeSelect}`
                : classes.gradeSelect
            }
            variant="standard"
            disableUnderline={true}>
            <MenuItem key="arvosana-null" disabled={true} value="null">
              {t('pistelaskuri.aine.valitsearvosana')}
            </MenuItem>
            {ARVOSANA_VALUES.map((arvo: number, id: number) => (
              <MenuItem key={`arvosana-${index}-${id}`} value={arvo}>
                {arvo}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            className={classes.gradeDelete}
            onClick={removeValinnaisaine}
            aria-label={t('pistelaskuri.aine.removevalinnainen')}>
            <MaterialIcon icon="delete" variant="outlined" />
          </IconButton>
        </SelectContainer>
      </InputLabel>
    </ValinnainenControl>
  );
};
