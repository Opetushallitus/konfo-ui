import { useMemo } from 'react';

import { toNostoOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
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
      ykiTestiinOsallistuminen: toNostoOsio(
        data,
        assetUrl,
        sivuData?.ykiTestiinOsallistuminenOtsikko,
        sivuData?.ykiTestiinOsallistuminenNostot
      ),
      ykiLisatietoa: toNostoOsio(
        data,
        assetUrl,
        sivuData?.ykiLisatietoaOtsikko,
        sivuData?.ykiLisatietoaNostot
      ),
      ajankohtaista: toNostoOsio(
        data,
        assetUrl,
        sivuData?.ajankohtaistaOtsikko,
        sivuData?.ajankohtaistaNostot
      ),
      useinKysytytKysymykset: {
        otsikko: sivuData?.useinKysytytKysymyksetOtsikko,
        // Ohitetaan viittaukset, joita vastaavaa kysymystä ei löydy (esim. julkaisematon)
        kysymykset: (sivuData?.useinKysytytKysymyksetLista ?? []).flatMap((ref) => {
          const faq = data.faq[ref?.id ?? ''];
          return faq ? [{ id: faq.id, kysymys: faq.question, vastaus: faq.answer }] : [];
        }),
      },
    };
  }, [data, assetUrl]);

  return { ...sivu, isLoading };
};
