import { useState } from 'react';

import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { VertailuSuosikki } from '#/src/types/common';

import { usePistelaskuriTulosState } from './usePistelaskuriTulosState';
import { KeskiArvoModal } from '../laskuri/KeskiarvoModal';

export const VertailuPistemaara = ({
  vertailuSuosikki,
}: {
  vertailuSuosikki: VertailuSuosikki;
}) => {
  const { t } = useTranslation();

  const [pistelaskuriOpen, setPistelaskuriOpen] = useState(false);
  const { tulos, setTulos } = usePistelaskuriTulosState();

  const isLukio = vertailuSuosikki?.koulutustyyppi === 'lk';

  return (
    vertailuSuosikki.edellinenHaku && (
      <Box fontWeight="normal">
        <KeskiArvoModal
          open={pistelaskuriOpen}
          closeFn={() => setPistelaskuriOpen(false)}
          updateTulos={setTulos}
          tulos={tulos}
        />
        <Typography fontWeight="bold" component="span">
          {vertailuSuosikki?.edellinenHaku?.pisteet}{' '}
        </Typography>
        {tulos && (
          <>
            {`(${t('suosikit-vertailu.pistemaarasi')} `}
            <Typography component="span" fontWeight="bold">
              {isLukio ? tulos?.keskiarvo : tulos?.pisteet}
            </Typography>
            {') '}
          </>
        )}
        <Link
          onClick={() => {
            setPistelaskuriOpen(true);
          }}>
          {t('suosikit-vertailu.laske-pistemaarasi')}
        </Link>
      </Box>
    )
  );
};
