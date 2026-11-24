import { useMemo } from 'react';

import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import { ContentfulNosto } from '#/src/types/ContentfulTypes';
import {
  EtusivuNosto,
  EtusivuOsio,
  NostoRef,
  toNostoOsio,
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

// Hakee uuden etusivun tiedot contentfulista ja purkaa viittaukset (nostot, linkit, kuvat) valmiiksi,
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

    const toOsio = (otsikko?: string, nostoRefs?: Array<NostoRef>): EtusivuOsio =>
      toNostoOsio(data, assetUrl, otsikko, nostoRefs);

    return {
      heroKuvaDesktop: assetUrl(tutuLaskeutumissivuData?.kuvaDesktop?.url),
      heroKuvaMobiili: assetUrl(tutuLaskeutumissivuData?.kuvaMobiili?.url),
      tutuPalveluopas: {
        otsikko: tutuLaskeutumissivuData?.paatoksenTarveOtsikko,
        nosto: toSingleNosto(
          data.nosto[tutuLaskeutumissivuData?.paatoksenTarveNosto?.id ?? '']
        ),
      },

      paatoksenHakeminen: toOsio(
        tutuLaskeutumissivuData?.paatoksenHakeminenOtsikko,
        tutuLaskeutumissivuData?.paatoksenHakeminenKortit
      ),
      yhteystiedot: {
        otsikko: tutuLaskeutumissivuData?.yhteystiedotOtsikko,
        sisalto: tutuLaskeutumissivuData?.yhteystiedotSisalto,
      },
    };
  }, [data, assetUrl]);

  return { ...etusivu, isLoading };
};
