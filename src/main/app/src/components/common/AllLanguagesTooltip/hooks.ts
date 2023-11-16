import { useQuery } from 'react-query';

import { getKoodistonKoodit } from '#/src/api/konfoApi';
import { Koodi } from '#/src/types/common';

export const usePainotettavatOppiaineetLukiossa = () => {
  const { data } = useQuery<Array<Koodi>>(
    ['getPainotettavatOppiaineetLukiossa'],
    () => getKoodistonKoodit('painotettavatoppiaineetlukiossa'),
    { staleTime: Infinity }
  );
  return data;
};
