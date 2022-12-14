import React, { useState } from 'react';

import {
  Box,
  styled,
  Typography,
  Select,
  FormControl,
  Input,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { localize } from '#/src/tools/localization';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Hakutieto } from '#/src/types/ToteutusTypes';

import { HakupisteLaskelma } from '../Keskiarvo';
import { AccessibleGraafi } from './AccessibleGraafi';
import { PisteGraafi } from './PisteGraafi';

const PREFIX = 'graafi__container__';

const classes = {
  hakukohdeControl: `${PREFIX}hakukohdecontrol`,
  hakukohdeLabel: `${PREFIX}hakukohdelabel`,
  hakukohdeSelect: `${PREFIX}hakukohdeselect`,
  hakukohdeInput: `${PREFIX}hakukohdeinput`,
  legend: `${PREFIX}legend`,
  legendScores: `${PREFIX}legend_scores`,
  legendScore: `${PREFIX}legend_score`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  background: `${colors.white} 0% 0% no-repeat padding-box`,
  boxShadow: '2px 2px 8px #0000001A',
  borderRadius: '2px',
  padding: '20px',
  textAlign: 'center',
  [`& .${classes.hakukohdeControl}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      rowGap: '1rem',
      textAlign: 'left',
    },
    [`& .${classes.hakukohdeLabel}`]: {
      fontSize: '1rem',
      fontWeight: 700,
      marginRight: '0.8rem',
    },
    [`& .${classes.hakukohdeSelect}`]: {
      minWidth: '25rem',
      maxWidth: '90vw',
      marginTop: '-0.5rem',
      '.MuiSelect-select': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      [theme.breakpoints.down('sm')]: {
        minWidth: '10rem',
      },
    },
    [`& .${classes.hakukohdeInput}`]: {
      border: `1px solid ${colors.lightGrey}`,
      padding: '0.5rem',
      textAlign: 'left',
      '&:focus-within': {
        borderColor: colors.black,
      },
      '&:hover': {
        borderColor: colors.black,
      },
    },
  },
  [`& .${classes.legend}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [`& .${classes.legendScores}`]: {
      width: '12px',
      height: '12px',
      backgroundColor: colors.verminal,
      marginRight: '12px',
    },
    [`& .${classes.legendScore}`]: {
      width: '19px',
      height: 0,
      border: `3px solid ${colors.sunglow}`,
      marginLeft: '25px',
      marginRight: '12px',
    },
  },
}));

type Props = {
  hakutiedot: Array<Hakutieto>;
  isLukio: boolean;
  tulos: HakupisteLaskelma | null;
};

export const GraafiContainer = ({ hakutiedot, isLukio, tulos }: Props) => {
  const { t } = useTranslation();
  const hakukohteet = hakutiedot.flatMap((tieto: Hakutieto) => tieto.hakukohteet);
  const [hakukohde, setHakukohde] = useState(hakukohteet[0]);

  const changeHakukohde = (event: SelectChangeEvent<Hakukohde>) =>
    setHakukohde(event.target.value as Hakukohde);

  return (
    <StyledBox>
      <FormControl variant="standard" className={classes.hakukohdeControl}>
        <label className={classes.hakukohdeLabel} htmlFor="hakukohde-select">
          {isLukio ? 'Linja:' : 'Koulutus:'}
        </label>
        <Select
          name="hakukohde-select"
          value={hakukohde}
          onChange={changeHakukohde}
          variant="standard"
          disableUnderline={true}
          className={classes.hakukohdeSelect}
          input={<Input className={classes.hakukohdeInput} />}>
          {hakukohteet.map((kohde: Hakukohde, index: number) => (
            <MenuItem key={`hakukohde-${index}`} value={kohde as any}>
              {localize(kohde.nimi)}
              {kohde.jarjestyspaikka ? `, ${localize(kohde.jarjestyspaikka.nimi)}` : ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {hakukohde?.metadata?.pistehistoria &&
        hakukohde?.metadata?.pistehistoria?.length > 0 && (
          <Box>
            <PisteGraafi hakukohde={hakukohde} tulos={tulos} isLukio={isLukio} />
            <Box className={classes.legend} aria-hidden={true}>
              <Box className={classes.legendScores} />
              <Typography sx={{ fontSize: '0.875rem' }}>
                {t(
                  isLukio
                    ? 'pistelaskuri.graafi.alin-keskiarvo'
                    : 'pistelaskuri.graafi.alin-pisteet'
                )}
              </Typography>
              <Box className={classes.legendScore} />
              <Typography sx={{ fontSize: '0.875rem' }}>
                {t(
                  isLukio
                    ? 'pistelaskuri.graafi.keskiarvosi'
                    : 'pistelaskuri.graafi.pisteesi'
                )}
              </Typography>
            </Box>
            <AccessibleGraafi isLukio={isLukio} tulos={tulos} hakukohde={hakukohde} />
          </Box>
        )}
      {!hakukohde?.metadata?.pistehistoria ||
        (hakukohde?.metadata?.pistehistoria?.length < 1 && (
          <Typography variant="body1" sx={{ fontWeight: 600, margin: '1rem 0' }}>
            {t('pistelaskuri.graafi.ei-tuloksia')}
          </Typography>
        ))}
    </StyledBox>
  );
};
