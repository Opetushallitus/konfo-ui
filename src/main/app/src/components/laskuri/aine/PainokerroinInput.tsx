import React, { useState } from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  InputLabel,
  FormControl,
  IconButton,
  Input,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { isEligiblePainokerroin } from '#/src/components/laskuri/Keskiarvo';

const PREFIX = 'keskiarvo__ainelaskuri__painokerroin__';

const classes = {
  input: `${PREFIX}input`,
  label: `${PREFIX}label`,
  delete: `${PREFIX}delete`,
  error: `${PREFIX}error`,
  add: `${PREFIX}add`,
};

const PainokerroinControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    marginTop: '0.4rem',
    justifyContent: 'stretch',
  },
  [`& .${classes.label}`]: {
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '1.6rem',
  },
  [`& .${classes.delete}`]: {
    color: colors.brandGreen,
    alignSelf: 'end',
    padding: '0.4rem 0.6rem',
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
  [`& .${classes.error}`]: {
    color: colors.red,
  },
  [`& .${classes.add}`]: {
    marginTop: '1.6rem',
    whiteSpace: 'nowrap',
  },
}));

type Props = {
  labelId: string;
  painokerroin: string;
  updatePainokerroin: (newPk: string) => void;
};

export const PainokerroinInput = ({
  labelId,
  painokerroin,
  updatePainokerroin,
}: Props) => {
  const { t } = useTranslation();

  const [showPainokerroin, setShowPainokerroin] = useState(painokerroin !== '');
  const [inputtedPainokerroin, setInputtedPainokerroin] = useState(painokerroin);

  const removePainokerroin = () => {
    setShowPainokerroin(false);
    updatePainokerroin('');
  };

  const handlePainokerroinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPk = event.target.value;
    setInputtedPainokerroin(newPk);
    if (isEligiblePainokerroin(newPk)) {
      updatePainokerroin(newPk);
    }
  };

  return (
    <PainokerroinControl variant="standard">
      {showPainokerroin ? (
        <>
          <InputLabel id={`${labelId}-painokerroin`} className={classes.label}>
            <Typography sx={{ fontWeight: '600', marginBottom: '7px' }}>
              {t('pistelaskuri.aine.painokerroin')}
            </Typography>
            <Input
              className={classes.input}
              onChange={handlePainokerroinChange}
              value={inputtedPainokerroin}
              error={!isEligiblePainokerroin(inputtedPainokerroin)}
              disableUnderline={true}
              placeholder={t('pistelaskuri.aine.painokerroin-placeholder')}
            />
          </InputLabel>
          <IconButton
            className={classes.delete}
            onClick={removePainokerroin}
            aria-label={t('pistelaskuri.aine.removepainokerroin')}>
            <DeleteOutlined />
          </IconButton>
          {inputtedPainokerroin !== '' &&
            !isEligiblePainokerroin(inputtedPainokerroin) && (
              <Typography variant="body2" className={classes.error}>
                {t('pistelaskuri.error.painokerroin')}
              </Typography>
            )}
        </>
      ) : (
        <Button
          className={classes.add}
          onClick={() => {
            setShowPainokerroin(true);
          }}>
          {t('pistelaskuri.aine.addpainokerroin')}
        </Button>
      )}
    </PainokerroinControl>
  );
};
