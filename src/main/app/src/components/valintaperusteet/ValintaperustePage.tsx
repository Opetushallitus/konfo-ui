import React, { useMemo } from 'react';

import { Grid } from '@mui/material';
import produce from 'immer';
import { isEmpty, isNumber, concat } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Askem } from '#/src/components/common/Askem';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { Murupolku } from '#/src/components/common/Murupolku';
import { Heading } from '#/src/components/Heading';
import { useScrollToHash } from '#/src/hooks/useScrollToHash';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { withDefaultProps } from '#/src/tools/withDefaultProps';

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

const RowContainer = withDefaultProps(
  styled(Grid)(() => ({
    paddingLeft: '10px',
    paddingRight: '10px',
  })),
  { container: true, direction: 'row' }
);

const Row: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <RowContainer justifyContent="center">
      <Grid item xs={12} sm={12} md={10}>
        {children}
      </Grid>
    </RowContainer>
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
  const hakukelpoisuusVisible = !isEmpty(hakukelpoisuus);
  const kuvausVisible = !isEmpty(kuvaus) || sisalto?.length > 0;
  const valintatavatVisible =
    valintatavat?.length > 0 || !isEmpty(hakukohde?.metadata?.kynnysehto);
  const valintakokeetVisible = valintakokeet?.length > 0;
  const yleiskuvauksetVisible =
    !isEmpty(yleiskuvaukset?.hakukohde) || !isEmpty(yleiskuvaukset?.valintaperuste);
  const lisatiedotVisible = !isEmpty(lisatiedot);
  const liitteetVisible = hakukohde?.liitteet.length > 0;
  const painotetutArvosanatVisible =
    hakukohde?.metadata?.hakukohteenLinja?.painotetutArvosanat.length > 0;
  const alinHyvaksyttyKeskiarvo =
    hakukohde?.metadata?.hakukohteenLinja?.alinHyvaksyttyKeskiarvo;
  const alinHyvaksyttyKeskiarvoVisible = isNumber(alinHyvaksyttyKeskiarvo);

  useScrollToHash();

  return (
    <React.Fragment>
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
        <Askem />
      </Grid>
    </React.Fragment>
  );
};

export const ValintaperustePreviewPage = () => {
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

  switch (true) {
    case isFetching:
      return <LoadingCircle />;
    case Boolean(error):
      return <NotFound />;
    default:
      return (
        <RowContainer spacing={0} justifyContent="flex-start">
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
        </RowContainer>
      );
  }
};

export const ValintaperustePage = () => {
  const { hakukohdeOid } = useParams<{ hakukohdeOid: string }>();
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const {
    data = {} as PageData,
    isFetching,
    error,
  } = useValintaperustePageData({
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
        const added = lisatilaisuudet?.find((tilaisuus: any) => tilaisuus.id === v.id)
          ?.tilaisuudet;
        return added
          ? produce(v, (draft: any) => {
              draft.tilaisuudet = concat(v.tilaisuudet, added);
            })
          : v;
      }
    );
    return concat(hakukohteenValintakokeet, usedValintaperusteenKokeet) || [];
  }, [hakukohteenValintakokeet, valintaperusteenValintakokeet, lisatilaisuudet]);

  const yleiskuvaukset = {
    hakukohde: hakukohde?.metadata?.valintakokeidenYleiskuvaus,
    valintaperuste: valintakokeidenYleiskuvaus,
  };

  switch (true) {
    case isFetching:
      return <LoadingCircle />;
    case Boolean(error):
      return <NotFound />;
    default:
      return (
        <div>
          <Row>
            <Murupolku
              path={[
                { name: t('haku.otsikko'), link: hakuUrl },
                { name: localize(koulutus?.nimi), link: `/koulutus/${koulutus?.oid}` },
                { name: localize(toteutus?.nimi), link: toteutusLink },
                { name: t('valintaperuste.valintaperuste') },
              ]}
            />
          </Row>
          <RowContainer spacing={0} justifyContent="flex-start">
            <Grid item xs={12} md={3} />
            <Grid item xs={12} md={6}>
              <Paluu paluuLinkki={toteutusLink} />
              <Heading>
                {t('lomake.valintaperusteet') + ' - ' + localize(hakukohde?.nimi)}
              </Heading>
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
          </RowContainer>
        </div>
      );
  }
};
