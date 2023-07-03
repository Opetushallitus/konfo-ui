import React, { useEffect, useState } from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  InputLabel,
  FormControl,
  IconButton,
  Input,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Kouluaine } from '#/src/components/laskuri/aine/Kouluaine';
import { isEligiblePainokerroin } from '#/src/components/laskuri/Keskiarvo';

const PREFIX = 'keskiarvo__ainelaskuri__painokerroin__';

const classes = {
  input: `${PREFIX}input`,
  label: `${PREFIX}label`,
  labelContainer: `${PREFIX}labelcontainer`,
  delete: `${PREFIX}delete`,
  error: `${PREFIX}error`,
  add: `${PREFIX}add`,
};

const PainokerroinControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  position: 'relative',
  top: '-2.1rem', // Offset by lineheight 1.6rem and rowgap 0.5rem to align headers
  [theme.breakpoints.down('sm')]: {
    top: 0,
  },
  [`& .${classes.labelContainer}`]: {
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'normal',
    lineHeight: '1.6rem',
    overflow: 'visible',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    alignItems: 'stretch',
    width: '100%',
  },
  [`& .${classes.delete}`]: {
    color: colors.brandGreen,
    alignSelf: 'start',
    padding: '0.3rem 0.6rem 0.5rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    maxWidth: '100%',
    width: '12rem',
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
    maxWidth: '12rem',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  [`& .${classes.add}`]: {
    marginTop: '1.6rem',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0',
    },
  },
}));

const InputContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
}));

type Props = {
  labelId: string;
  kouluaine: Kouluaine;
  updatePainokerroin: (newPk: string) => void;
};

export const PainokerroinInput = ({ labelId, kouluaine, updatePainokerroin }: Props) => {
  const { t } = useTranslation();

  const [showPainokerroin, setShowPainokerroin] = useState(kouluaine.painokerroin !== '');
  const [inputtedPainokerroin, setInputtedPainokerroin] = useState(
    kouluaine.painokerroin
  );

  const removePainokerroin = () => {
    setShowPainokerroin(false);
    setInputtedPainokerroin('');
    updatePainokerroin('');
  };

  useEffect(() => {
    setShowPainokerroin(kouluaine.painokerroin !== '');
    setInputtedPainokerroin(kouluaine.painokerroin);
  }, [kouluaine]);

  const handlePainokerroinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPk = event.target.value;
    setInputtedPainokerroin(newPk);
    if (isEligiblePainokerroin(newPk)) {
      updatePainokerroin(newPk);
    }
  };

  return (
    <PainokerroinControl variant="standard" sx={{ minWidth: 220 }}>
      {showPainokerroin ? (
        <>
          <InputLabel id={`${labelId}-painokerroin`} className={classes.labelContainer}>
            <Typography className={classes.label}>
              {t('pistelaskuri.aine.painokerroin')}
            </Typography>
            <InputContainer>
              <Input
                className={classes.input}
                onChange={handlePainokerroinChange}
                value={inputtedPainokerroin}
                error={!isEligiblePainokerroin(inputtedPainokerroin)}
                disableUnderline={true}
                placeholder={t('pistelaskuri.aine.painokerroin-placeholder')}
              />
              <IconButton
                className={classes.delete}
                onClick={removePainokerroin}
                aria-label={t('pistelaskuri.aine.removepainokerroin')}>
                <DeleteOutlined />
              </IconButton>
            </InputContainer>
          </InputLabel>
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
