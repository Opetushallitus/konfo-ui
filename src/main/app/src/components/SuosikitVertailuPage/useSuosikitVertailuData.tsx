import { isEmpty } from 'lodash-es';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikitVertailu } from '#/src/api/konfoApi';

export const useSuosikitVertailuData = (oids?: Array<string>) =>
  useQuery(
    ['getSuosikitVertailu', oids],
    () => getHakukohdeSuosikitVertailu({ 'hakukohde-oids': oids! }),
    {
      enabled: !isEmpty(oids),
    }
  );
