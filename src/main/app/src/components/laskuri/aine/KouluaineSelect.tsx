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

import { LabelTooltip } from '../../common/LabelTooltip';
import { ARVOSANA_VALUES, Kouluaine } from './Kouluaine';

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

const AineSelectControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== 'isLisakieli',
})<{ isLisakieli: boolean }>(({ theme, isLisakieli }) => ({
  display: 'grid',
  gridTemplateAreas: isLisakieli
    ? `"label label"
     "select kieli"`
    : `"label label"
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
  aine: Kouluaine;
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
      isLisakieli={isLisaKieli}
      variant="standard"
      sx={{ minWidth: 220 }}
      className={classes.gradeControl}>
      <div className={classes.gradeLabelContainer}>
        <InputLabel id={labelId} className={classes.gradeLabel}>
          {t(aine.nimi)}
        </InputLabel>
        <div>
          {aine.description && (
            <LabelTooltip
              title={t(aine.description)}
              sx={{ marginLeft: '3px', color: colors.brandGreen }}></LabelTooltip>
          )}
        </div>
      </div>
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
          <DeleteOutlined />
        </IconButton>
      )}
    </AineSelectControl>
  );
};
