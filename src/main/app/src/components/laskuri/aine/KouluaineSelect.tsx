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
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { LabelTooltip } from '../../common/LabelTooltip';
import { KieliSelect } from './KieliSelect';
import { ARVOSANA_VALUES, Kouluaine, Kieliaine, isKieliaine } from './Kouluaine';
const PREFIX = 'kouluaine__';

const classes = {
  input: `${PREFIX}input`,
  optionDisabled: `${PREFIX}option--disabled`,
  headerContainer: `${PREFIX}headerContainer`,
  header: `${PREFIX}header`,
  gradeControl: `${PREFIX}gradecontrol`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeLabelContainer: `${PREFIX}gradelabelcontainer`,
  gradeSelect: `${PREFIX}gradeselect`,
  poistakieli: `${PREFIX}poistakieli`,
};

const formGridArea = (isKieli: boolean, isLisaKieli: boolean): string => {
  if (isKieli && isLisaKieli) {
    return `"header header"
            "label label"
            "select kieli"`;
  } else if (isKieli) {
    return `"header header"
            "label label"
            "select select"`;
  } else if (isLisaKieli) {
    return `"label label"
            "select kieli"`;
  } else {
    return `"label label"
            "select select"`;
  }
};

const AineSelectControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== 'isLisakieli' && prop !== 'isKieli',
})<{ isLisakieli: boolean; isKieli: boolean }>(({ theme, isLisakieli, isKieli }) => ({
  display: 'grid',
  gridTemplateAreas: formGridArea(isKieli, isLisakieli),
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
  [`& .${classes.headerContainer}`]: {
    gridArea: 'header',
    [`.${classes.header}`]: {
      fontWeight: 600,
      display: 'flex',
      marginBottom: '0.5rem',
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
    fontWeight: isKieliaine ? 'normal' : 600,
    maxWidth: '12rem',
    lineHeight: '1.6rem',
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
  aine: Kouluaine | Kieliaine;
  updateArvosana: (arvosana: number) => void;
  updateKieli: (koodiUri: string) => void;
  isLisaKieli?: boolean;
  removeLisaKieli?: () => void;
};

export const KouluaineSelect = ({
  aine,
  updateArvosana,
  updateKieli,
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
      isKieli={isKieliaine(aine)}
      isLisakieli={isLisaKieli}
      variant="standard"
      sx={{ minWidth: 220 }}
      className={classes.gradeControl}>
      {isKieliaine(aine) && (
        <div className={classes.headerContainer}>
          <Typography className={classes.header}>
            {t(aine.nimi)}
            <LabelTooltip
              title={t(aine.kuvaus)}
              sx={{ marginLeft: '3px', color: colors.brandGreen }}></LabelTooltip>
          </Typography>
          <KieliSelect aine={aine} updateKieli={updateKieli} />
        </div>
      )}
      <div className={classes.gradeLabelContainer}>
        <InputLabel id={labelId} className={classes.gradeLabel}>
          {t(isKieliaine(aine) ? 'Arvosana' : aine.nimi)}
        </InputLabel>
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
