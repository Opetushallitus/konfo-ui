import { includes } from 'lodash';
import { urls } from 'oph-urls-js';

import { useHakuunValitut } from '#/src/hooks/useSuosikitSelection';
import { BaseSuosikki } from '#/src/types/common';

export const useSiirryHakulomakkeelleInfo = (data?: Array<BaseSuosikki>) => {
  const hakuunValitut = useHakuunValitut();

  const hakuunValitutData =
    data?.filter((suosikki) => includes(hakuunValitut, suosikki?.hakukohdeOid)) ?? [];

  const firstValittuHakuOid = hakuunValitutData?.[0]?.hakuOid;

  const isValid = hakuunValitutData.length > 0;

  return {
    url:
      isValid && firstValittuHakuOid
        ? urls.url('ataru.hakemus-haku', firstValittuHakuOid) +
          `?hakukohteet=${hakuunValitutData.map((i) => i.hakukohdeOid).join(',')}`
        : '',
    isValid,
    count: hakuunValitutData.length,
  };
};
