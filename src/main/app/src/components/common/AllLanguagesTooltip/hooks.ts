import { useQuery } from '@tanstack/react-query';

import { getKoodistonKoodit } from '#/src/api/konfoApi';
import { Koodi } from '#/src/types/common';

export const usePainotettavatOppiaineetLukiossa = () => {
  const { data } = useQuery<Array<Koodi>>({
    queryKey: ['getPainotettavatOppiaineetLukiossa'],
    queryFn: () => getKoodistonKoodit('painotettavatoppiaineetlukiossa'),
    staleTime: Infinity,
  });
  return data;
};
