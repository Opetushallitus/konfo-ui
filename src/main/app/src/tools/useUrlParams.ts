import { useCallback, useMemo } from 'react';

import qs from 'query-string';
import { useHistory } from 'react-router-dom';

import { cleanRequestParams } from '#/src/tools/utils';

export const useUrlParams = () => {
  const history = useHistory();
  const search = useMemo(
    () => qs.parse(history.location.search, { parseNumbers: true }),
    [history.location.search]
  );

  const updateUrlSearchParams = useCallback(
    (updatedProps: object) => {
      history.replace({ search: qs.stringify(cleanRequestParams(updatedProps)) });
    },
    [history]
  );

  const isDraft = useMemo(() => Boolean(search?.draft), [search]);

  return {
    isDraft,
    search,
    updateUrlSearchParams,
  };
};
