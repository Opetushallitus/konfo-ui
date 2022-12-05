import React, { useState, useEffect } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import {
  Box,
  styled,
  Typography,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode, colors } from '#/src/colors';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Hakutieto } from '#/src/types/ToteutusTypes';

import { HakupisteLaskelma } from './Keskiarvo';
import { KeskiArvoModal } from './KeskiarvoModal';
import { LocalStorageUtil, RESULT_STORE_KEY } from './LocalStorageUtil';
import { PisteGraafi } from './PisteGraafi';

const PREFIX = 'PisteContainer__';

const classes = {
  infoBox: `${PREFIX}infobox`,
  openButton: `${PREFIX}openbutton`,
  infoIcon: `${PREFIX}__infobox__icon`,
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
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  [`.${classes.infoIcon}`]: {
    marginRight: '8px',
  },
}));

type Props = {
  hakutiedot: Array<Hakutieto>;
};

export const PisteContainer = ({ hakutiedot }: Props) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const hakukohteet = hakutiedot.flatMap((tieto: Hakutieto) => tieto.hakukohteet);
  const [hakukohde, setHakukohde] = useState(hakukohteet[0]);
  const [tulos, setTulos] = useState<HakupisteLaskelma | null>(null);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(RESULT_STORE_KEY);
    setTulos(savedResult as HakupisteLaskelma | null);
  }, []);

  const changeHakukohde = (event: SelectChangeEvent<Hakukohde>) =>
    setHakukohde(event.target.value as Hakukohde);

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
      <Button onClick={() => setModalOpen(true)} className={classes.openButton}>
        &nbsp;{t('pistelaskuri.graafi.laske-ja-vertaa')}
      </Button>
      <Select
        value={hakukohde}
        onChange={changeHakukohde}
        variant="standard"
        disableUnderline={true}>
        {hakukohteet.map((kohde: Hakukohde, index: number) => (
          <MenuItem key={`hakukohde-${index}`} value={kohde as any}>
            {localize(kohde.nimi)}
          </MenuItem>
        ))}
      </Select>
      <KeskiArvoModal
        open={isModalOpen}
        closeFn={() => setModalOpen(false)}
        updateTulos={setTulos}></KeskiArvoModal>
      {hakukohde?.metadata?.pistehistoria &&
        hakukohde?.metadata?.pistehistoria?.length > 0 && (
          <PisteGraafi hakukohde={hakukohde} tulos={tulos} />
        )}
      {!hakukohde?.metadata?.pistehistoria ||
        (hakukohde?.metadata?.pistehistoria?.length < 1 && (
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Hakukohteesta ei ole aiempien vuosien pistetietoja
          </Typography>
        ))}
    </StyledPageSection>
  );
};
