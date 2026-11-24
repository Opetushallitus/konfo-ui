import { useMemo } from 'react';

import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import {
  ContentfulData,
  ContentfulLinkki,
  ContentfulNosto,
} from '#/src/types/ContentfulTypes';

export type EtusivuNosto = {
  id: string;
  otsikko: string;
  teksti?: string;
  kuvaUrl?: string;
  color?: ContentfulNosto['color'];
  linkit?: Array<{
    id: string;
    teksti?: string;
    href?: string;
    variant?: ContentfulLinkki['variant'];
  }>;
};

export type EtusivuOsio = {
  otsikko?: string;
  nostot: Array<EtusivuNosto>;
};

type NostoRef = { id: string } | undefined;

// Hakee uuden etusivun tiedot contentfulista ja purkaa viittaukset (nostot, linkit, kuvat) valmiiksi,
// jotta komponenttien ei tarvitse käsitellä contentfulin tietorakennetta
export const useOpintopolkuEtusivuData = () => {
  const { data, isLoading, assetUrl } = useContentful();

  const etusivu = useMemo(() => {
    const etusivuData = getOne(data.opintopolkuEtusivu);

    // Etusivun nostoilla on aina vain yksi linkki
    const toEtusivuNosto = (nosto: ContentfulNosto): EtusivuNosto => ({
      id: nosto.id,
      otsikko: nosto.otsikko,
      teksti: nosto.teksti,
      kuvaUrl: assetUrl(nosto.kuva?.url),
      color: nosto.color,
      linkit: nosto.linkit?.map((linkRef) => {
        const linkki = data.linkki[linkRef.id ?? ''];
        return {
          id: linkki.id,
          teksti: linkki.teksti,
          href: linkki.href,
          variant: linkki.variant,
        };
      }),
    });

    const toOsio = (otsikko?: string, nostoRefs: Array<NostoRef> = []): EtusivuOsio => ({
      otsikko,
      nostot: resolveNostot(data, nostoRefs).map(toEtusivuNosto),
    });

    return {
      heroKuvaDesktop: assetUrl(etusivuData?.kuvaDesktop?.url),
      heroKuvaMobiili: assetUrl(etusivuData?.kuvaMobiili?.url),
      koulutustieto: toOsio(
        etusivuData?.koulutustietoOtsikko,
        etusivuData?.koulutustietoNostot
      ),
      kirjautuneenPalvelut: toOsio(
        etusivuData?.kirjautuneenPalvelutOtsikko,
        etusivuData?.kirjautuneenPalvelutNostot
      ),
      muutPalvelut: toOsio(
        etusivuData?.muutPalvelutOtsikko,
        etusivuData?.muutPalvelutNostot
      ),
    };
  }, [data, assetUrl]);

  return { ...etusivu, isLoading };
};

// Ohitetaan viittaukset, joita vastaavaa nostoa ei löydy (esim. julkaisematon nosto)
const resolveNostot = (data: ContentfulData, nostoRefs: Array<NostoRef>) =>
  nostoRefs.flatMap((ref) => data.nosto[ref?.id ?? ''] ?? []);
