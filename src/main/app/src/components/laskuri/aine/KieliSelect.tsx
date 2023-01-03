import React from 'react';

import {
  styled,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Input,
  SelectChangeEvent,
} from '@mui/material';
import { colors } from 'src/colors';

import { translate } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

import { useKieliKoodit } from '../hooks';
import { Kieliaine } from './Kouluaine';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  optionDisabled: `${PREFIX}option--disabled`,
  gradeControl: `${PREFIX}gradecontrol`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeLabelContainer: `${PREFIX}gradelabelcontainer`,
  gradeSelect: `${PREFIX}gradeselect`,
  gradeInfo: `${PREFIX}gradeinfo`,
  poistakieli: `${PREFIX}poistakieli`,
};

const KieliSelectControl = styled(FormControl)(({ theme }) => ({
  display: 'grid',
  gridTemplateAreas: `"label label"
     "select select"`,
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'start',
  justifyItems: 'start',
  rowGap: '7px',
  columnGap: '2px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '7fr 1fr',
    width: '100%',
    justifyItems: 'stretch',
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
    },
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
  [`& .${classes.gradeLabelContainer}`]: {
    gridArea: 'label',
    display: 'flex',
    alignItems: 'center',
    columnGap: '2px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  [`& .${classes.gradeLabel}`]: {
    overflow: 'unset',
    textOverflow: 'unset',
    overflowWrap: 'normal',
    whiteSpace: 'break-spaces',
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'semibold',
    maxWidth: '12rem',
    lineHeight: '1.6rem',
  },
  [`& .${classes.gradeInfo}`]: {
    padding: '0',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
      marginTop: '-4px',
    },
  },
  [`& .${classes.gradeSelect}`]: {
    gridArea: 'select',
  },
  [`& .${classes.poistakieli}`]: {
    gridArea: 'kieli',
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
}));

type Props = {
  aine: Kieliaine;
  updateKieli: (koodiUri: string) => void;
};

export const KieliSelect = ({ aine, updateKieli }: Props) => {
  const { data } = useKieliKoodit();

  const handleKieliChange = (event: SelectChangeEvent) => {
    updateKieli(event.target.value);
  };

  return (
    <KieliSelectControl
      variant="standard"
      sx={{ minWidth: 220 }}
      className={classes.gradeControl}>
      <div className={classes.gradeLabelContainer}>
        <InputLabel className={classes.gradeLabel}>Kieli</InputLabel>
      </div>
      {data !== undefined && (
        <Select
          value={String(aine.kieliKoodi)}
          onChange={handleKieliChange}
          input={<Input className={classes.input} />}
          className={
            aine.kieliKoodi == null
              ? `${classes.optionDisabled} ${classes.gradeSelect}`
              : classes.gradeSelect
          }
          variant="standard"
          disableUnderline={true}>
          <MenuItem key="arvosana-null" disabled={true} value="null">
            Valitse kieli
          </MenuItem>
          {data.map((kieli: Koodi, index: number) => (
            <MenuItem key={`arvosana-${index}`} value={kieli.koodiUri}>
              {translate(kieli.nimi)}
            </MenuItem>
          ))}
        </Select>
      )}
    </KieliSelectControl>
  );
};
