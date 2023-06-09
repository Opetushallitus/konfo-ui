import React from 'react';

import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { TFunction } from 'i18next';
import { join } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { formatDouble } from '#/src/tools/utils';
import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

import { GRAAFI_MIN_YEAR, MAX_ITEMS } from './GraafiUtil';
import { HakupisteLaskelma, ENSISIJAINEN_SCORE_BONUS } from '../Keskiarvo';

type Props = {
  hakukohde: Hakukohde;
  tulos: HakupisteLaskelma | null;
  isLukio: boolean;
};

const hakukohdeToPisterajat = (
  t: TFunction<'translation', undefined>,
  hakukohde: Hakukohde,
  isLukio: boolean
) => {
  const pisterajat = hakukohde.metadata?.pistehistoria
    ?.filter(
      (historia: PisteHistoria) => Number.parseInt(historia.vuosi) >= GRAAFI_MIN_YEAR
    )
    .sort(
      (a: PisteHistoria, b: PisteHistoria) =>
        Number.parseInt(a.vuosi) - Number.parseInt(b.vuosi)
    )
    .slice(0, MAX_ITEMS)
    .map((historia: PisteHistoria) =>
      t(
        isLukio
          ? 'pistelaskuri.graafi.saavutettavuus.vuosika'
          : 'pistelaskuri.graafi.saavutettavuus.vuosipiste',
        { vuosi: historia.vuosi, pisteet: formatDouble(historia.pisteet) }
      )
    );
  return join(pisterajat, ' ');
};

const tulosToText = (
  t: TFunction<'translation', undefined>,
  tulos: HakupisteLaskelma,
  isLukio: boolean
) =>
  isLukio
    ? t('pistelaskuri.graafi.saavutettavuus.ka', {
        keskiarvo: formatDouble(tulos.keskiarvo),
      })
    : t('pistelaskuri.graafi.saavutettavuus.pisteet', {
        tulos: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS,
      });

export const AccessibleGraafi = ({ hakukohde, tulos, isLukio }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={visuallyHidden}>
      <Typography>
        {t('pistelaskuri.graafi.saavutettavuus.saate', {
          kohde: `${localize(hakukohde.nimi)} ${
            hakukohde.jarjestyspaikka
              ? `, ${localize(hakukohde.jarjestyspaikka.nimi)}`
              : ''
          }`,
        })}
      </Typography>
      <Typography>{hakukohdeToPisterajat(t, hakukohde, isLukio)}</Typography>
      {tulos && <Typography>{tulosToText(t, tulos, isLukio)}</Typography>}
    </Box>
  );
};
