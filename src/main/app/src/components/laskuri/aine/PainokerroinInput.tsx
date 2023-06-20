import React, { useState } from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  InputLabel,
  FormControl,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { isEligiblePainokerroin } from '#/src/components/laskuri/Keskiarvo';

const PREFIX = 'keskiarvo__ainelaskuri__painokerroin__';

const classes = {
  input: `${PREFIX}input`,
  label: `${PREFIX}label`,
  delete: `${PREFIX}delete`,
  error: `${PREFIX}error`,
};

const PainokerroinControl = styled(FormControl)(({ theme }) => ({
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
  [`& .${classes.label}`]: {
    gridArea: 'label',
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '1.6rem',
  },
  [`& .${classes.delete}`]: {
    gridArea: 'delete',
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
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
}));

type Props = {
  labelId: string;
  painokerroin: string;
  updatePainokerroin: (newPk: string) => void;
  removePainokerroin: () => void;
};

export const PainokerroinInput = ({
  labelId,
  painokerroin,
  updatePainokerroin,
  removePainokerroin,
}: Props) => {
  const { t } = useTranslation();

  const [inputtedPainokerroin, setInputtedPainokerroin] = useState(painokerroin);

  return (
    <PainokerroinControl variant="standard">
      <InputLabel id={`${labelId}-painokerroin`} className={classes.label}>
        {t('pistelaskuri.aine.painokerroin')}
      </InputLabel>
      <Input
        className={classes.input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newPk = event.target.value;
          setInputtedPainokerroin(newPk);
          if (isEligiblePainokerroin(newPk)) {
            updatePainokerroin(newPk);
          }
        }}
        value={inputtedPainokerroin}
        error={!isEligiblePainokerroin(inputtedPainokerroin)}
        disableUnderline={true}
      />
      {!isEligiblePainokerroin(inputtedPainokerroin) && (
        <Typography variant="body2" className={classes.error}>
          {t('pistelaskuri.aine.error.painokerroin')}
        </Typography>
      )}

      <IconButton
        className={classes.delete}
        onClick={removePainokerroin}
        aria-label={t('pistelaskuri.aine.removepainokerroin')}>
        <DeleteOutlined />
      </IconButton>
    </PainokerroinControl>
  );
};
