import React, { useEffect, useMemo } from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { Heading } from '#/src/components/Heading';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';
import { scrollIntoView } from '#/src/tools/utils';

import { AlinHyvaksyttyKeskiarvo } from './AlinHyvaksyttyKeskiarvo';
import { Hakukelpoisuus } from './Hakukelpoisuus';
import {
  PageData,
  PreviewPageData,
  useValintaperustePageData,
  useValintaperustePreviewPageData,
} from './hooks';
import { Kuvaus } from './Kuvaus';
import { Liitteet } from './Liitteet';
import { Lisatiedot } from './Lisatiedot';
import { PainotetutArvosanat } from './PainotetutArvosanat';
import { Paluu } from './Paluu';
import { Sisallysluettelo } from './Sisallysluettelo';
import { Valintakokeet } from './Valintakokeet';
import { Valintatavat } from './Valintatavat';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" className={classes.container}>
      <Grid item xs={12} sm={12} md={10}>
        {children}
      </Grid>
    </Grid>
  );
};

type ContentProps = {
  hakukohde?: any;
  toteutus?: any;
  valintakokeet: any;
  valintaperuste: any;
  valintatavat: any;
  yleiskuvaukset: any;
};

const ValintaperusteContent = ({
  hakukohde,
  toteutus,
  valintakokeet,
  valintaperuste,
  valintatavat,
  yleiskuvaukset,
}: ContentProps) => {
  const { hakukelpoisuus, kuvaus, lisatiedot, sisalto } = valintaperuste?.metadata || {};
  const hakukelpoisuusVisible = !_fp.isEmpty(hakukelpoisuus);
  const kuvausVisible = !_fp.isEmpty(kuvaus) || sisalto?.length > 0;
  const valintatavatVisible =
    valintatavat?.length > 0 || !_fp.isEmpty(hakukohde?.metadata?.kynnysehto);
  const valintakokeetVisible = valintakokeet?.length > 0;
  const yleiskuvauksetVisible =
    !_fp.isEmpty(yleiskuvaukset?.hakukohde) ||
    !_fp.isEmpty(yleiskuvaukset?.valintaperuste);
  const lisatiedotVisible = !_fp.isEmpty(lisatiedot);
  const liitteetVisible = hakukohde?.liitteet.length > 0;
  const painotetutArvosanatVisible =
    hakukohde?.metadata?.hakukohteenLinja?.painotetutArvosanat.length > 0;
  const alinHyvaksyttyKeskiarvo =
    hakukohde?.metadata?.hakukohteenLinja?.alinHyvaksyttyKeskiarvo;
  const alinHyvaksyttyKeskiarvoVisible = _fp.isNumber(alinHyvaksyttyKeskiarvo);

  const { hash } = useLocation();

  useEffect(() => {
    const el = hash ? document.getElementById(hash.substring(1)) : null;
    if (el) {
      scrollIntoView(el);
    }
  }, [hash]);

  return (
    <>
      <Grid item xs={12} md={3}>
        <Sisallysluettelo
          {...{
            hakukelpoisuusVisible,
            kuvausVisible,
            alinHyvaksyttyKeskiarvoVisible,
            painotetutArvosanatVisible,
            valintatavatVisible,
            valintakokeetVisible,
            lisatiedotVisible,
            liitteetVisible,
          }}
        />
      </Grid>
      <Grid item container xs={12} md={6} spacing={2}>
        {hakukelpoisuusVisible && <Hakukelpoisuus hakukelpoisuus={hakukelpoisuus} />}
        {kuvausVisible && <Kuvaus kuvaus={kuvaus} sisalto={sisalto} />}
        {alinHyvaksyttyKeskiarvoVisible && (
          <AlinHyvaksyttyKeskiarvo alinHyvaksyttyKeskiarvo={alinHyvaksyttyKeskiarvo} />
        )}
        {painotetutArvosanatVisible && (
          <PainotetutArvosanat
            arvosanat={hakukohde?.metadata?.hakukohteenLinja?.painotetutArvosanat}
          />
        )}
        {valintatavatVisible && (
          <Valintatavat
            valintatavat={valintatavat}
            hakukohteenKynnysehto={hakukohde?.metadata?.kynnysehto}
          />
        )}
        {(valintakokeetVisible || yleiskuvauksetVisible) && (
          <Valintakokeet yleiskuvaukset={yleiskuvaukset} valintakokeet={valintakokeet} />
        )}
        {lisatiedotVisible && <Lisatiedot lisatiedot={lisatiedot} />}
        {liitteetVisible && (
          <Liitteet
            liitteet={hakukohde?.liitteet}
            hakukohde={hakukohde}
            organisaatioOid={toteutus?.organisaatio?.oid}
          />
        )}
      </Grid>
    </>
  );
};

export const ValintaperustePreviewPage = () => {
  const classes = useStyles();
  const { valintaperusteId } = useParams<{ valintaperusteId: string }>();
  const { t } = useTranslation();

  const {
    data = {} as PreviewPageData,
    isFetching,
    error,
  } = useValintaperustePreviewPageData({
    valintaperusteId,
  });
  const { valintaperuste } = data;

  const {
    metadata: { valintakokeidenYleiskuvaus, valintatavat },
    valintakokeet,
  } = valintaperuste || { metadata: { kuvaus: {}, valintatavat: [] } };
  const yleiskuvaukset = {
    valintaperuste: valintakokeidenYleiskuvaus,
  };

  return isFetching ? (
    <LoadingCircle />
  ) : !error ? (
    <Grid
      container
      direction="row"
      spacing={0}
      justify="flex-start"
      className={classes.container}>
      <Grid item xs={12} md={3} />
      <Grid item xs={12} md={6}>
        <Heading>{t('lomake.valintaperusteet')}</Heading>
      </Grid>
      <Grid item xs={12} md={3} />
      <ValintaperusteContent
        {...{
          valintaperuste,
          valintakokeet,
          valintatavat,
          yleiskuvaukset,
        }}
      />
    </Grid>
  ) : (
    <NotFound />
  );
};

export const ValintaperustePage = () => {
  const classes = useStyles();
  const { hakukohdeOid } = useParams<{ hakukohdeOid: string }>();
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const { data = {} as PageData, isFetching, error } = useValintaperustePageData({
    hakukohdeOid,
  });
  const { valintaperuste, koulutus, toteutus, hakukohde } = data;

  const {
    metadata: { valintakokeidenYleiskuvaus, valintatavat = [] },
    valintakokeet: valintaperusteenValintakokeet = [],
  } = valintaperuste || { metadata: {} };

  const {
    metadata: { valintaperusteenValintakokeidenLisatilaisuudet: lisatilaisuudet = [] },
    valintakokeet: hakukohteenValintakokeet = [],
  } = hakukohde || { metadata: {} };

  const toteutusLink = toteutus && `/toteutus/${toteutus.oid}`;
  const valintakokeet = useMemo(() => {
    const usedValintaperusteenKokeet = (valintaperusteenValintakokeet || []).map(
      (v: any) => {
        const added = lisatilaisuudet?.find((t: any) => t.id === v.id)?.tilaisuudet;
        return added ? _fp.set('tilaisuudet', _fp.concat(v.tilaisuudet, added), v) : v;
      }
    );
    return _fp.concat(hakukohteenValintakokeet, usedValintaperusteenKokeet) || [];
  }, [hakukohteenValintakokeet, valintaperusteenValintakokeet, lisatilaisuudet]);

  const yleiskuvaukset = {
    hakukohde: hakukohde?.metadata?.valintakokeidenYleiskuvaus,
    valintaperuste: valintakokeidenYleiskuvaus,
  };

  return isFetching ? (
    <LoadingCircle />
  ) : !error ? (
    <>
      <Row>
        <Murupolku
          path={[
            { name: t('haku.otsikko'), link: hakuUrl.url },
            { name: localize(koulutus?.nimi), link: `/koulutus/${koulutus?.oid}` },
            { name: localize(toteutus?.nimi), link: toteutusLink },
            { name: localize(valintaperuste?.nimi) },
          ]}
        />
      </Row>
      <Grid
        container
        direction="row"
        spacing={0}
        justify="flex-start"
        className={classes.container}>
        <Grid item xs={12} md={3} />
        <Grid item xs={12} md={6}>
          <Paluu paluuLinkki={toteutusLink} />
          <Heading>{t('lomake.valintaperusteet')}</Heading>
        </Grid>
        <Grid item xs={12} md={3} />
        <ValintaperusteContent
          {...{
            hakukohde,
            toteutus,
            valintaperuste,
            valintakokeet,
            valintatavat,
            yleiskuvaukset,
          }}
        />
      </Grid>
    </>
  ) : (
    <NotFound />
  );
};
