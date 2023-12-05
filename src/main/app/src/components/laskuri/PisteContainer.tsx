import React, { useState, useEffect } from 'react';

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { PageSection } from '#/src/components/common/PageSection';
import { InfoBox } from '#/src/components/laskuri/InfoBox';
import { styled } from '#/src/theme';
import { Hakutieto } from '#/src/types/ToteutusTypes';

import { GraafiContainer } from './graafi/GraafiContainer';
import { HakupisteLaskelma } from './Keskiarvo';
import { KeskiArvoModal } from './KeskiarvoModal';
import {
  LocalStorageUtil,
  RESULT_STORE_KEY,
  KOULUAINE_STORE_KEY,
  AVERAGE_STORE_KEY,
} from './LocalStorageUtil';

const PREFIX = 'PisteContainer__';

const classes = {
  openButton: `${PREFIX}openbutton`,
  purifyButton: `${PREFIX}purifybutton`,
  buttonsBox: `${PREFIX}__buttonsbox`,
};

const StyledPageSection = styled(PageSection)(({ theme }) => ({
  [`.${classes.buttonsBox}`]: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '1rem',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [`.${classes.openButton}`]: {
      fontSize: '1rem',
      backgroundColor: colors.brandGreen,
      color: colors.white,
      fontWeight: 600,
      '&:hover': {
        backgroundColor: colors.brandGreen,
      },
    },
    [`.${classes.purifyButton}`]: {
      fontSize: '1rem',
      border: `2px solid ${colors.brandGreen}`,
      color: colors.brandGreen,
      marginLeft: '1.5rem',
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginTop: '0.8rem',
      },
    },
  },
}));

const MODAL_KEY_PREFIX = 'PISTELASKURI_MODAL_KEY_';
let MODAL_KEY_COUNTER = 1;

type Props = {
  hakutiedot: Array<Hakutieto>;
  isLukio: boolean;
};

export const PisteContainer = ({ hakutiedot, isLukio }: Props) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [tulos, setTulos] = useState<HakupisteLaskelma | null>(null);
  const [modalKey, setModalKey] = useState(MODAL_KEY_PREFIX + MODAL_KEY_COUNTER);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(RESULT_STORE_KEY);
    setTulos(savedResult as HakupisteLaskelma | null);
  }, []);

  const clearData = () => {
    setTulos(null);
    LocalStorageUtil.remove(RESULT_STORE_KEY);
    LocalStorageUtil.remove(AVERAGE_STORE_KEY);
    LocalStorageUtil.remove(KOULUAINE_STORE_KEY);
    setModalKey(MODAL_KEY_PREFIX + ++MODAL_KEY_COUNTER);
  };

  return (
    <StyledPageSection heading={t('pistelaskuri.graafi.heading')}>
      <InfoBox />
      <Box className={classes.buttonsBox}>
        <Button onClick={() => setModalOpen(true)} className={classes.openButton}>
          &nbsp;{t('pistelaskuri.graafi.laske-ja-vertaa')}
        </Button>
        {tulos && (
          <Button onClick={clearData} className={classes.purifyButton}>
            {t('pistelaskuri.graafi.poista')}
          </Button>
        )}
      </Box>
      <KeskiArvoModal
        key={modalKey}
        open={isModalOpen}
        closeFn={() => setModalOpen(false)}
        updateTulos={setTulos}
        tulos={tulos}
      />
      <GraafiContainer hakutiedot={hakutiedot} tulos={tulos} isLukio={isLukio} />
    </StyledPageSection>
  );
};
