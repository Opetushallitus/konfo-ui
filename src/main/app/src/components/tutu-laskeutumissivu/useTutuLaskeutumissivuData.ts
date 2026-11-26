import { useMemo } from 'react';

import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import { ContentfulData, ContentfulNosto } from '#/src/types/ContentfulTypes';
import {
  EtusivuNosto,
  EtusivuOsio,
  NostoRef,
  resolveNostot,
} from '../opintopolku-etusivu/useOpintopolkuEtusivuData';

export type OsioWithSingleNosto = {
  otsikko?: string;
  nosto: Nosto;
};

type Nosto = Omit<EtusivuNosto, 'linkit'> & {
  href?: string;
  tyyppi?: string;
};

export type YhteystiedotType = {
  otsikko?: string;
  sisalto?: string;
};

const toLinkit = (nosto: ContentfulNosto, data: ContentfulData) => {
  return nosto.linkit?.map((linkRef) => {
    const linkki = data.linkki[linkRef.id ?? ''];
    return {
      id: linkki.id,
      href: linkki.href,
      variant: linkki.variant,
    };
  });
};

const toKuvaLinkNosto =
  (data: ContentfulData, assetUrl: (url?: string) => string | undefined) =>
  (nosto: ContentfulNosto): EtusivuNosto => ({
    id: nosto.id,
    otsikko: nosto.otsikko,
    kuvaUrl: assetUrl(nosto.kuva?.url),
    linkit: toLinkit(nosto, data),
  });

const toTextLinkNosto =
  (data: ContentfulData, _: (url?: string) => string | undefined) =>
  (nosto: ContentfulNosto): EtusivuNosto => ({
    id: nosto.id,
    otsikko: nosto.otsikko,
    linkit: toLinkit(nosto, data),
  });

export const toTutuNostoOsio = (
  data: ContentfulData,
  assetUrl: (url?: string) => string | undefined,
  toNosto: (
    data: ContentfulData,
    assetUrl: (url?: string) => string | undefined
  ) => (nosto: ContentfulNosto) => EtusivuNosto,
  otsikko?: string,
  nostoRefs: Array<NostoRef> = []
): EtusivuOsio => ({
  otsikko,
  nostot: resolveNostot(data, nostoRefs).map(toNosto(data, assetUrl)),
});

// Hakee uuden tutu-laskeutumissivun tiedot contentfulista ja purkaa viittaukset (nostot, linkit, kuvat) valmiiksi,
// jotta komponenttien ei tarvitse käsitellä contentfulin tietorakennetta
export const useTutuLaskeutumissivuData = () => {
  const { data, isLoading, assetUrl } = useContentful();

  const etusivu = useMemo(() => {
    const tutuLaskeutumissivuData = getOne(data.tutkintojenTunnustaminenLaskeutumissivu);

    const toSingleNosto = (nosto: ContentfulNosto): Nosto => ({
      id: nosto?.id,
      otsikko: nosto?.otsikko,
      teksti: nosto?.teksti,
      kuvaUrl: assetUrl(nosto?.kuva?.url),
      href: data.linkki[nosto?.linkit?.[0]?.id ?? '']?.href,
      tyyppi: nosto?.tyyppi,
    });

    return {
      heroKuvaDesktop: assetUrl(tutuLaskeutumissivuData?.kuvaDesktop?.url),
      heroKuvaMobiili: assetUrl(tutuLaskeutumissivuData?.kuvaMobiili?.url),
      tutuPalveluopas: {
        otsikko: tutuLaskeutumissivuData?.paatoksenTarveOtsikko,
        nosto: toSingleNosto(
          data.nosto[tutuLaskeutumissivuData?.paatoksenTarveNosto?.id ?? '']
        ),
      },
      paatoksenHakeminen: toTutuNostoOsio(
        data,
        assetUrl,
        toKuvaLinkNosto,
        tutuLaskeutumissivuData?.paatoksenHakeminenOtsikko,
        tutuLaskeutumissivuData?.paatoksenHakeminenKortit
      ),
      tutuUKK: toTutuNostoOsio(
        data,
        assetUrl,
        toTextLinkNosto,
        tutuLaskeutumissivuData?.useinKysytytKysymyksetOtsikko,
        tutuLaskeutumissivuData?.useinKysytytKysymyksetLista
      ),
      videot: toTutuNostoOsio(
        data,
        assetUrl,
        toKuvaLinkNosto,
        tutuLaskeutumissivuData?.videotOtsikko,
        tutuLaskeutumissivuData?.videot
      ),
      yhteystiedot: {
        otsikko: tutuLaskeutumissivuData?.yhteystiedotOtsikko,
        sisalto: tutuLaskeutumissivuData?.yhteystiedotSisalto,
      },
    };
  }, [data, assetUrl]);

  return { ...etusivu, isLoading };
};
