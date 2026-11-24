import { useMemo } from 'react';

import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';

// Hakee kielitutkintojen laskeutumissivun tiedot contentfulista ja purkaa viittaukset valmiiksi,
// jotta komponenttien ei tarvitse käsitellä contentfulin tietorakennetta
export const useKielitutkinnotData = () => {
  const { data, isLoading, assetUrl } = useContentful();

  const sivu = useMemo(() => {
    const sivuData = getOne(data.kielitutkinnotLaskeutumissivu);

    return {
      heroKuvaDesktop: assetUrl(sivuData?.kuvaDesktop?.url),
    };
  }, [data, assetUrl]);

  return { ...sivu, isLoading };
};
