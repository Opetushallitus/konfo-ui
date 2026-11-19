import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';

import { getHakukohdeSuosikitVertailu } from '#/src/api/konfoApi';

export const useSuosikitVertailuData = (oids?: Array<string>) =>
  useQuery({
    queryKey: ['getSuosikitVertailu', oids],
    queryFn: () => getHakukohdeSuosikitVertailu({ 'hakukohde-oids': oids! }),
    enabled: !isEmpty(oids),
  });
