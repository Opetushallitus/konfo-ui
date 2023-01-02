import { useQuery } from 'react-query';

import { getKoodistonKoodit } from '#/src/api/konfoApi';
import { Koodi } from '#/src/types/common';

export const useKieliKoodit = () => {
  return useQuery<Array<Koodi>>(
    ['getKoodistonKoodit'],
    () => getKoodistonKoodit('kielivalikoima'),
    { staleTime: Infinity }
  );
};
