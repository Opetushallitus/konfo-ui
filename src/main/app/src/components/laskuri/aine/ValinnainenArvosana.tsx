import React from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Input,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

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
  display: 'grid',
  gridTemplateColumns: '4fr 1fr',
  gridTemplateAreas: `"label label"
                     "select delete"`,
  alignItems: 'center',
  alignContent: 'center',
  rowGap: '7px',
  [theme.breakpoints.down('sm')]: {
    marginTop: '0.4rem',
    justifyContent: 'stretch',
    gridTemplateColumns: '7fr 1fr',
  },
  [`& .${classes.gradeLabel}`]: {
    gridArea: 'label',
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'semibold',
    lineHeight: '1.6rem',
  },
  [`& .${classes.gradeDelete}`]: {
    gridArea: 'delete',
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
  [`& .${classes.gradeSelect}`]: {
    gridArea: 'select',
    marginTop: 0,
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
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
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
    <ValinnainenControl variant="standard">
      <InputLabel id={`${labelId}-${index}`} className={classes.gradeLabel}>
        {t('pistelaskuri.aine.valinnaisaine')}
      </InputLabel>
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
        <DeleteOutlined />
      </IconButton>
    </ValinnainenControl>
  );
};
