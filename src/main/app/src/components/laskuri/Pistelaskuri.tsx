import React, { useState, useEffect } from 'react';

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';
import { scrollIntoView } from '#/src/tools/utils';

import { KeskiarvoAineLaskuri } from './aine/KeskiarvoAineLaskuri';
import { Kouluaineet } from './aine/Kouluaine';
import {
  Keskiarvot,
  HakupisteLaskelma,
  keskiArvotToHakupiste,
  isValidKeskiarvo,
  kouluaineetToHakupiste,
} from './Keskiarvo';
import { KeskiarvoLaskuri } from './KeskiarvoLaskuri';
import { KeskiarvoTulos } from './KeskiarvoTulos';
import {
  AVERAGE_STORE_KEY,
  KOULUAINE_STORE_KEY,
  LocalStorageUtil,
  RESULT_STORE_KEY,
} from './LocalStorageUtil';
import { VertaaHakukohteeseen } from './VertaaHakukohteeseen';

const PREFIX = 'Pistelaskuri__';

const classes = {
  calcButton: `${PREFIX}calculatebutton`,
  recalcButton: `${PREFIX}recalculatebutton`,
  buttonWrapper: `${PREFIX}buttoncontainer`,
  clearButton: `${PREFIX}clearbutton`,
};

const StyledDiv = styled('div')(({ theme }) => ({
  [`.${classes.buttonWrapper}`]: {
    textAlign: 'right',
    marginTop: '2rem',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '1rem',
    },
    [`.${classes.calcButton}`]: {
      border: `2px solid ${colors.brandGreen}`,
      backgroundColor: colors.brandGreen,
      color: colors.white,
      marginLeft: '1.5rem',
      fontWeight: 600,
      fontSize: '1rem',
      '&:hover': {
        backgroundColor: colors.brandGreen,
      },
      '&:disabled': {
        backgroundColor: colors.lightGrey,
        border: `2px solid ${colors.lightGrey}`,
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
    [`.${classes.recalcButton},.${classes.clearButton}`]: {
      border: `2px solid ${colors.brandGreen}`,
      color: colors.brandGreen,
      marginLeft: '1.5rem',
      fontWeight: 600,
      fontSize: '1rem',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
  },
}));

type Props = {
  updateTulos: (tulos: HakupisteLaskelma | null) => void;
  tulos: HakupisteLaskelma | null;
  embedded?: boolean;
  closeFn?: () => void;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const Pistelaskuri = ({
  updateTulos,
  tulos,
  embedded = false,
  closeFn = () => {},
  rootRef,
}: Props) => {
  const { t } = useTranslation();

  const [useKeskiarvoLaskuri, setUseKeskiarvoLaskuri] = useState<boolean>(true);

  const [kouluaineetToCalculate, setKouluaineetToCalculate] = useState<Kouluaineet>(
    new Kouluaineet()
  );

  const initialKeskiarvot = {
    lukuaineet: '',
    taideTaitoAineet: '',
    kaikki: '',
    suorittanut: true,
  };

  const [keskiarvoToCalculate, setKeskiarvoToCalculate] =
    useState<Keskiarvot>(initialKeskiarvot);

  useEffect(() => {
    if (tulos != null) {
      LocalStorageUtil.save(RESULT_STORE_KEY, tulos);
    }
  }, [tulos]);

  const calcButtonDisabled =
    useKeskiarvoLaskuri &&
    (!isValidKeskiarvo(keskiarvoToCalculate.lukuaineet) ||
      keskiarvoToCalculate.lukuaineet === '' ||
      !isValidKeskiarvo(keskiarvoToCalculate.taideTaitoAineet) ||
      keskiarvoToCalculate.taideTaitoAineet === '' ||
      !isValidKeskiarvo(keskiarvoToCalculate.kaikki) ||
      keskiarvoToCalculate.kaikki === '');

  const calculate = () => {
    const laskettuTulos = useKeskiarvoLaskuri
      ? keskiArvotToHakupiste(keskiarvoToCalculate)
      : kouluaineetToHakupiste(kouluaineetToCalculate);
    updateTulos(laskettuTulos);
  };

  const clearTulos = () => {
    LocalStorageUtil.remove(RESULT_STORE_KEY);
    updateTulos(null);
    scrollIntoView(rootRef.current);
  };

  const clearValues = () => {
    LocalStorageUtil.remove(AVERAGE_STORE_KEY);
    LocalStorageUtil.remove(KOULUAINE_STORE_KEY);
    setKeskiarvoToCalculate(initialKeskiarvot);
    setKouluaineetToCalculate(new Kouluaineet());
    clearTulos();
  };

  return (
    <StyledDiv>
      {tulos == null && useKeskiarvoLaskuri && (
        <KeskiarvoLaskuri
          changeCalculator={setUseKeskiarvoLaskuri}
          updateKeskiarvoToCalculate={setKeskiarvoToCalculate}
          keskiarvot={keskiarvoToCalculate}
          embedded={embedded}
        />
      )}
      {tulos == null && !useKeskiarvoLaskuri && (
        <KeskiarvoAineLaskuri
          changeCalculator={setUseKeskiarvoLaskuri}
          updateKouluaineetToCalculate={setKouluaineetToCalculate}
          kouluaineet={kouluaineetToCalculate}
          embedded={embedded}
        />
      )}
      {tulos && (
        <KeskiarvoTulos
          tulos={tulos}
          embedded={embedded}
          kouluaineet={kouluaineetToCalculate}
          rootRef={rootRef}
        />
      )}
      <Box className={classes.buttonWrapper}>
        <Button className={classes.clearButton} onClick={clearValues}>
          {t('pistelaskuri.tyhjenna')}
        </Button>
        {tulos == null && (
          <Button
            disabled={calcButtonDisabled}
            className={classes.calcButton}
            onClick={calculate}>
            {t('pistelaskuri.laske')}
          </Button>
        )}
        {tulos && !embedded && (
          <Button className={classes.calcButton} onClick={closeFn}>
            {t('pistelaskuri.vertaa')}
          </Button>
        )}
        {tulos && (
          <Button
            className={embedded ? classes.calcButton : classes.recalcButton}
            onClick={clearTulos}>
            {t('pistelaskuri.laske-uudestaan')}
          </Button>
        )}
      </Box>
      {tulos && embedded && <VertaaHakukohteeseen tulos={tulos} />}
    </StyledDiv>
  );
};
