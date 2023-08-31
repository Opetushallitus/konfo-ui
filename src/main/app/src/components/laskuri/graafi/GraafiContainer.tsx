import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Select,
  FormControl,
  Input,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { colors } from '#/src/colors';
import { YHTEISHAKU_KOODI_URI } from '#/src/constants';
import { setHakukohde as setHk } from '#/src/store/reducers/pistelaskuriSlice';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Hakutieto } from '#/src/types/ToteutusTypes';

import { AccessibleGraafi } from './AccessibleGraafi';
import {
  containsOnlyTodistusvalinta,
  getStyleByPistetyyppi,
  getUniquePistetyypit,
} from './GraafiUtil';
import { PainotetutArvosanat } from './PainotetutArvosanat';
import { PisteGraafi } from './PisteGraafi';
import { Kouluaineet, kopioiKouluaineetPainokertoimilla } from '../aine/Kouluaine';
import {
  HakupisteLaskelma,
  LaskelmaTapa,
  lukuaineKeskiarvoPainotettu,
} from '../Keskiarvo';
import { KOULUAINE_STORE_KEY, LocalStorageUtil } from '../LocalStorageUtil';
import { hasPainokertoimia } from '../PisteLaskuriUtil';

const PREFIX = 'graafi__container__';

const classes = {
  hakukohdeControl: `${PREFIX}hakukohdecontrol`,
  hakukohdeLabel: `${PREFIX}hakukohdelabel`,
  hakukohdeSelect: `${PREFIX}hakukohdeselect`,
  hakukohdeInput: `${PREFIX}hakukohdeinput`,
  legend: `${PREFIX}legend`,
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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

type Props = {
  hakutiedot: Array<Hakutieto>;
  isLukio: boolean;
  tulos: HakupisteLaskelma | null;
};

export const GraafiContainer = ({ hakutiedot, isLukio, tulos }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hakukohteet = hakutiedot
    .filter(
      (tieto: Hakutieto) => tieto.hakutapa?.koodiUri?.includes(YHTEISHAKU_KOODI_URI)
    )
    .flatMap((tieto: Hakutieto) => tieto.hakukohteet);
  const [hakukohde, setHakukohde] = useState(hakukohteet[0]);
  const [calculatedTulos, setCalculatedTulos] = useState(tulos);
  const [isTodistusvalinta, setTodistusvalinta] = useState(
    containsOnlyTodistusvalinta(hakukohteet[0])
  );
  useEffect(() => {
    setTodistusvalinta(containsOnlyTodistusvalinta(hakukohde));
  }, [isTodistusvalinta, hakukohde]);
  useEffect(() => {
    if (
      tulos?.tapa === LaskelmaTapa.LUKUAINEET &&
      hakukohde &&
      hasPainokertoimia(hakukohde)
    ) {
      const savedResult = LocalStorageUtil.load(KOULUAINE_STORE_KEY);
      if (savedResult) {
        const aineet = savedResult as Kouluaineet;
        const modifiedAineet = kopioiKouluaineetPainokertoimilla(
          aineet,
          hakukohde.hakukohteenLinja?.painotetutArvosanat || []
        );
        setCalculatedTulos({
          ...tulos,
          keskiarvoPainotettu: lukuaineKeskiarvoPainotettu(modifiedAineet),
        });
      }
    } else {
      setCalculatedTulos(tulos);
    }
    dispatch(setHk(hakukohde));
  }, [tulos, hakukohde, dispatch]);

  const changeHakukohde = (event: SelectChangeEvent<Hakukohde>) => {
    const uusiHakukohde = event.target.value as Hakukohde;
    setHakukohde(uusiHakukohde);
  };

  const getTextKeyByPistetyyppi = (pistetyyppi: string): string => {
    switch (pistetyyppi) {
      case 'valintatapajono_yp':
        return ` (${t('pistelaskuri.graafi.yhteispisteet')})`;
      case 'valintatapajono_kp':
        return ` (${t('pistelaskuri.graafi.koepisteet')})`;
      case 'valintatapajono_tv':
        return ` (${t('pistelaskuri.graafi.todistusvalinta')})`;
      default:
        return ''; // valintatapajono_m tai tieto puuttuu
    }
  };

  return (
    <StyledBox>
      <FormControl variant="standard" className={classes.hakukohdeControl}>
        <label className={classes.hakukohdeLabel} htmlFor="hakukohde-select">
          {t(
            isLukio
              ? 'pistelaskuri.graafi.hakukohde.lukio'
              : 'pistelaskuri.graafi.hakukohde.muu'
          )}
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
            <PisteGraafi
              hakukohde={hakukohde}
              tulos={calculatedTulos}
              isLukio={isTodistusvalinta}
            />
            <Box className={classes.legend} aria-hidden={true}>
              {getUniquePistetyypit(hakukohde).map((valintatapajonoTyyppi) => (
                <>
                  <Typography sx={{ fontSize: '0.875rem' }}>
                    <Box
                      sx={{
                        width: '12px',
                        height: '12px',
                        marginLeft: '24px',
                        marginRight: '6px',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                        backgroundColor: getStyleByPistetyyppi(valintatapajonoTyyppi),
                      }}
                    />
                    {isTodistusvalinta
                      ? t('pistelaskuri.graafi.alin-keskiarvo')
                      : t('pistelaskuri.graafi.alin-pisteet') +
                        getTextKeyByPistetyyppi(valintatapajonoTyyppi)}
                  </Typography>
                </>
              ))}

              {tulos && (
                <Typography sx={{ fontSize: '0.875rem' }}>
                  <Box
                    sx={{
                      width: '19px',
                      height: 0,
                      border: `3px solid ${colors.sunglow}`,
                      marginLeft: '25px',
                      marginRight: '12px',
                      verticalAlign: 'middle',
                      display: 'inline-block',
                    }}
                  />
                  {t(
                    isTodistusvalinta
                      ? 'pistelaskuri.graafi.keskiarvosi'
                      : 'pistelaskuri.graafi.pisteesi'
                  )}
                </Typography>
              )}
            </Box>
            <AccessibleGraafi
              isLukio={isLukio}
              tulos={calculatedTulos}
              hakukohde={hakukohde}
            />
          </Box>
        )}
      {!hakukohde?.metadata?.pistehistoria ||
        (hakukohde?.metadata?.pistehistoria?.length < 1 && (
          <Typography variant="body1" sx={{ fontWeight: 600, margin: '1rem 0' }}>
            {t('pistelaskuri.graafi.ei-tuloksia')}
          </Typography>
        ))}
      {hakukohde && hasPainokertoimia(hakukohde) && (
        <PainotetutArvosanat
          painotetutArvosanat={hakukohde.hakukohteenLinja?.painotetutArvosanat || []}
        />
      )}
    </StyledBox>
  );
};
