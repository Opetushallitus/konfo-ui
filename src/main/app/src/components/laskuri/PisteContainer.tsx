import React, { useState, useEffect } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { Box, styled, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode, colors } from '#/src/colors';
import { PageSection } from '#/src/components/common/PageSection';
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
  infoBox: `${PREFIX}infobox`,
  openButton: `${PREFIX}openbutton`,
  purifyButton: `${PREFIX}purifybutton`,
  infoIcon: `${PREFIX}__infobox__icon`,
  buttonsBox: `${PREFIX}__buttonsbox`,
};

const StyledPageSection = styled(PageSection)(() => ({
  [` .${classes.infoBox}`]: {
    maxWidth: '982px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    padding: '0.8rem',
    paddingRight: '0.9rem',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
    marginBottom: '1rem',
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
  },
  [`.${classes.infoIcon}`]: {
    marginRight: '8px',
  },
  [`.${classes.buttonsBox}`]: {
    display: 'inline',
    marginBottom: '1rem',
  },
}));

type Props = {
  hakutiedot: Array<Hakutieto>;
  isLukio: boolean;
};

export const PisteContainer = ({ hakutiedot, isLukio }: Props) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [tulos, setTulos] = useState<HakupisteLaskelma | null>(null);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(RESULT_STORE_KEY);
    setTulos(savedResult as HakupisteLaskelma | null);
  }, []);

  const clearData = () => {
    setTulos(null);
    LocalStorageUtil.remove(RESULT_STORE_KEY);
    LocalStorageUtil.remove(AVERAGE_STORE_KEY);
    LocalStorageUtil.remove(KOULUAINE_STORE_KEY);
  };

  return (
    <StyledPageSection heading={t('pistelaskuri.graafi.heading')}>
      <Box className={classes.infoBox}>
        <InfoOutlined className={classes.infoIcon} />
        <Typography variant="body1">
          {t('pistelaskuri.graafi.info')}
          <span style={{ fontWeight: 600 }}>
            &nbsp;{t('pistelaskuri.graafi.info-rohkaisu')}
          </span>
        </Typography>
      </Box>
      <Box className={classes.buttonsBox}>
        <Button onClick={() => setModalOpen(true)} className={classes.openButton}>
          &nbsp;{t('pistelaskuri.graafi.laske-ja-vertaa')}
        </Button>
        {tulos && (
          <Button onClick={clearData} className={classes.purifyButton}>
            Poista tietosi
          </Button>
        )}
      </Box>
      <KeskiArvoModal
        open={isModalOpen}
        closeFn={() => setModalOpen(false)}
        updateTulos={setTulos}
        tulos={tulos}></KeskiArvoModal>
      <GraafiContainer hakutiedot={hakutiedot} tulos={tulos} isLukio={isLukio} />
    </StyledPageSection>
  );
};
