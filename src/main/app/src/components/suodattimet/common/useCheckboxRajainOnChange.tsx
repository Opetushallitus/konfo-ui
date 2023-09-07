import { useCallback } from 'react';

import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainItem } from '#/src/types/SuodatinTypes';

export const useCheckboxRajainOnChange = (
  rajainItems: Array<RajainItem>,
  setFilters: (rajainValues: Record<string, Array<string>>) => void
) =>
  useCallback(
    (item: RajainItem) => {
      setFilters(getStateChangesForCheckboxRajaimet(rajainItems)(item));
    },
    [rajainItems, setFilters]
  );
