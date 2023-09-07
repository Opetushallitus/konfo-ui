import React from 'react';

import {
  Select,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Input,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { ARVOSANA_VALUES, Kouluaine, Kieliaine } from './Kouluaine';
const PREFIX = 'kouluaine__';

const classes = {
  input: `${PREFIX}input`,
  optionDisabled: `${PREFIX}option--disabled`,
  headerContainer: `${PREFIX}headerContainer`,
  header: `${PREFIX}header`,
  gradeSelect: `${PREFIX}gradeselect`,
  poistakieli: `${PREFIX}poistakieli`,
};

const AineSelectControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== 'isLisaKieli',
})<{ isLisaKieli: boolean }>(({ theme, isLisaKieli }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  rowGap: '0.5rem',
  columnGap: '2px',
  marginBottom: '27px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: 0,
  },
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
    width: '12rem',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: isLisaKieli ? 0 : '2.7rem',
    },
  },
  [`& .${classes.headerContainer}`]: {
    [`.${classes.header}`]: {
      fontWeight: 600,
      display: 'flex',
      marginBottom: '0.5rem',
    },
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
  [`& .${classes.poistakieli}`]: {
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
}));

type Props = {
  aine: Kouluaine | Kieliaine;
  updateArvosana: (arvosana: number) => void;
  isLisaKieli?: boolean;
  removeLisaKieli?: () => void;
};

export const KouluaineSelect = ({
  aine,
  updateArvosana,
  isLisaKieli = false,
  removeLisaKieli = () => {},
}: Props) => {
  const { t } = useTranslation();
  const labelId = `aine-label-${aine.nimi}`.replaceAll('.', '-');

  const handleArvosanaChange = (event: SelectChangeEvent) => {
    updateArvosana(Number(event.target.value));
  };

  return (
    <AineSelectControl
      isLisaKieli={isLisaKieli}
      variant="standard"
      sx={{ minWidth: 220 }}>
      <Select
        labelId={labelId}
        value={String(aine.arvosana)}
        onChange={handleArvosanaChange}
        input={<Input className={classes.input} />}
        className={
          String(aine.arvosana) === 'null'
            ? `${classes.optionDisabled} ${classes.gradeSelect}`
            : classes.gradeSelect
        }
        variant="standard"
        disableUnderline={true}>
        <MenuItem key="arvosana-null" disabled={true} value="null">
          {t('pistelaskuri.aine.valitsearvosana')}
        </MenuItem>
        {ARVOSANA_VALUES.map((arvosana: number, index: number) => (
          <MenuItem key={`arvosana-${index}`} value={arvosana}>
            {arvosana}
          </MenuItem>
        ))}
      </Select>
      {isLisaKieli && (
        <IconButton
          className={classes.poistakieli}
          onClick={removeLisaKieli}
          aria-label={t('pistelaskuri.aine.removekieli')}>
          <MaterialIcon icon="delete" variant="outlined" />
        </IconButton>
      )}
    </AineSelectControl>
  );
};
