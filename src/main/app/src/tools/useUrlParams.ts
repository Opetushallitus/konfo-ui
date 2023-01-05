import { useCallback, useMemo } from 'react';

import qs from 'query-string';
import { useNavigate, useLocation } from 'react-router-dom';

import { cleanRequestParams } from '#/src/tools/utils';

export const useUrlParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = useMemo(
    () => qs.parse(location.search, { parseNumbers: true }),
    [location.search]
  );

  const updateUrlSearchParams = useCallback(
    (updatedProps: object) => {
      navigate(
        { search: qs.stringify(cleanRequestParams(updatedProps)) },
        { replace: true }
      );
    },
    [navigate]
  );

  const isDraft = useMemo(() => Boolean(search?.draft), [search]);

  return {
    isDraft,
    search,
    updateUrlSearchParams,
  };
};
