import React from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
  Input,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  optionDisabled: `${PREFIX}option--disabled`,
  gradeControl: `${PREFIX}gradecontrol`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeSelect: `${PREFIX}gradeselect`,
  gradeInfo: `${PREFIX}gradeinfo`,
  button: `${PREFIX}button`,
};

const PainoControl = styled(FormControl)(() => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '38px',
  alignItems: 'center',
  alignContent: 'center',
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
  },
  button: {
    fontSize: '1rem',
  },
  [`& .${classes.error}`]: {
    color: colors.red,
    maxWidth: '60%',
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
  [`& .${classes.gradeControl}`]: {
    display: 'grid',
    gridTemplateColumns: '6fr 1fr',
    gridTemplateAreas: `"label info"
                       "select select"`,
    alignItems: 'center',
    alignContent: 'center',
    rowGap: '7px',
    [`& .${classes.gradeLabel}`]: {
      gridArea: 'label',
      overflow: 'unset',
      textOverflow: 'unset',
      position: 'relative',
      transformOrigin: 'left',
      transform: 'none',
      fontSize: '1rem',
      fontWeight: 'semibold',
    },
    [`& .${classes.gradeInfo}`]: {
      gridArea: 'info',
    },
    [`& .${classes.gradeSelect}`]: {
      gridArea: 'select',
    },
  },
}));

type Props = {
  painokerroin: string;
  updatePainokerroin: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePainokerroin: () => void;
};

export const PainokerroinInput = ({
  painokerroin,
  updatePainokerroin,
  removePainokerroin,
}: Props) => {
  const { t } = useTranslation();

  return (
    <PainoControl variant="standard">
      <InputLabel>
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('pistelaskuri.aine.painokerroin')}
        </Typography>
        <Input
          className={classes.input}
          onChange={updatePainokerroin}
          value={painokerroin}
          disableUnderline={true}></Input>
      </InputLabel>
      <IconButton
        onClick={removePainokerroin}
        aria-label={t('pistelaskuri.aine.removepainokerroin')}>
        <DeleteOutlined />
      </IconButton>
    </PainoControl>
  );
};
