import { useMemo } from 'react';

import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import { ContentfulNosto } from '#/src/types/ContentfulTypes';
import { EtusivuNosto, NostoRef } from '../opintopolku-etusivu/useOpintopolkuEtusivuData';

export type Osio = {
  otsikko?: string;
  nosto: Nosto;
};

type Nosto = Omit<EtusivuNosto, 'linkit'> & {
  href?: string;
  tyyppi?: string;
};

// Hakee uuden etusivun tiedot contentfulista ja purkaa viittaukset (nostot, linkit, kuvat) valmiiksi,
// jotta komponenttien ei tarvitse käsitellä contentfulin tietorakennetta
export const useTutuLaskeutumissivuData = () => {
  const { data, isLoading, assetUrl } = useContentful();

  const etusivu = useMemo(() => {
    const tutuLaskeutumissivuData = getOne(data.tutkintojenTunnustaminenLaskeutumissivu);

    const toNosto = (nosto: ContentfulNosto): Nosto => ({
      id: nosto?.id,
      otsikko: nosto?.otsikko,
      teksti: nosto?.teksti,
      kuvaUrl: assetUrl(nosto?.kuva?.url),
      href: data.linkki[nosto?.linkit?.[0]?.id ?? '']?.href,
      tyyppi: nosto?.tyyppi,
    });

    const toOsio = (otsikko?: string, nostoRef?: NostoRef): Osio => ({
      otsikko,
      nosto: toNosto(data.nosto[nostoRef?.id ?? '']),
    });

    return {
      heroKuvaDesktop: assetUrl(tutuLaskeutumissivuData?.kuvaDesktop?.url),
      heroKuvaMobiili: assetUrl(tutuLaskeutumissivuData?.kuvaMobiili?.url),
      tutuPalveluopas: toOsio(
        tutuLaskeutumissivuData?.paatoksenTarveOtsikko,
        tutuLaskeutumissivuData?.paatoksenTarveNosto
      ),
    };
  }, [data, assetUrl]);

  return { ...etusivu, isLoading };
};
