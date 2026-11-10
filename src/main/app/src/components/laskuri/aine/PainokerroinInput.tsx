import React, { useEffect, useId, useState } from 'react';

import { FormControl, IconButton, Input, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Kouluaine } from '#/src/components/laskuri/aine/Kouluaine';
import { isEligiblePainokerroin } from '#/src/components/laskuri/Keskiarvo';
import { styled } from '#/src/theme';

const PREFIX = 'keskiarvo__ainelaskuri__painokerroin__';

const classes = {
  input: `${PREFIX}input`,
  label: `${PREFIX}label`,
  labelContainer: `${PREFIX}labelcontainer`,
  delete: `${PREFIX}delete`,
  error: `${PREFIX}error`,
  hint: `${PREFIX}hint`,
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
    border: `1px solid ${colors.grey500}`,
    padding: '0 0.5rem',
    maxWidth: '100%',
    width: '12rem',
    '&:focus-within': {
      borderColor: colors.grey900,
    },
    '&:hover': {
      borderColor: colors.grey900,
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
  [`& .${classes.hint}`]: {
    color: colors.grey700,
    lineHeight: '1rem',
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

  const inputId = useId();
  const hintId = `${inputId}-ohje`;
  const errorId = `${inputId}-virhe`;
  const showError =
    inputtedPainokerroin !== '' && !isEligiblePainokerroin(inputtedPainokerroin);

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
          <Box className={classes.labelContainer}>
            <Typography
              component="label"
              id={`${labelId}-painokerroin`}
              htmlFor={inputId}
              className={classes.label}>
              {t('pistelaskuri.aine.painokerroin')}
            </Typography>
            <InputContainer>
              <Input
                id={inputId}
                className={classes.input}
                onChange={handlePainokerroinChange}
                value={inputtedPainokerroin}
                error={!isEligiblePainokerroin(inputtedPainokerroin)}
                disableUnderline={true}
                inputProps={{
                  'aria-describedby': showError ? `${hintId} ${errorId}` : hintId,
                }}
              />
              <IconButton
                className={classes.delete}
                onClick={removePainokerroin}
                aria-label={t('pistelaskuri.aine.removepainokerroin')}>
                <MaterialIcon icon="delete" variant="outlined" />
              </IconButton>
            </InputContainer>
            <Typography variant="body2" id={hintId} className={classes.hint}>
              {t('pistelaskuri.aine.painokerroin-placeholder')}
            </Typography>
          </Box>
          {showError && (
            <Typography variant="body2" id={errorId} className={classes.error}>
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
