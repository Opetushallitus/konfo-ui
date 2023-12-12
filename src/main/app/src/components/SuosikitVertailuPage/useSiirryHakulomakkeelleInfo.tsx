import { urls } from 'oph-urls-js';

import { useHakuunValitut } from '#/src/hooks/useSuosikitSelection';
import { VertailuSuosikki } from '#/src/types/common';

export const useSiirryHakulomakkeelleInfo = (data?: Array<VertailuSuosikki>) => {
  const hakuunValitut = useHakuunValitut();

  const hakuunValitutData =
    data?.filter((suosikki) => hakuunValitut?.includes(suosikki.hakukohdeOid)) ?? [];

  const firstValittuHakuOid = hakuunValitutData?.[0]?.hakuOid;

  const isValid = hakuunValitutData.length > 0;

  return {
    url: isValid
      ? urls.url('ataru.hakemus-haku', firstValittuHakuOid) +
        `?hakukohteet=${hakuunValitutData.map((i) => i.hakukohdeOid).join(',')}`
      : '',
    isValid,
    count: hakuunValitutData.length,
  };
};
