import { useMemo } from 'react';

import { formatISO } from 'date-fns';
import { castArray, orderBy, toPairs } from 'lodash';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Suosikki = {
  timestamp: string;
  compare?: boolean;
  haku?: boolean;
};

export interface SuosikitState {
  suosikitSelection: Record<string, Suosikki>;
  toggleSuosikki: (id: string) => void;
  removeSuosikit: (ids: string | Array<string>) => void;
  toggleVertailu: (id: string) => void;
  toggleHaku: (id: string) => void;
}

const useSuosikitState = create<SuosikitState>()(
  persist(
    immer((set) => ({
      suosikitSelection: {},
      toggleSuosikki: (id) =>
        set((state) => {
          if (state.suosikitSelection[id]) {
            delete state.suosikitSelection[id];
          } else {
            state.suosikitSelection[id] = {
              timestamp: formatISO(new Date()),
            };
          }
        }),
      removeSuosikit: (ids) =>
        set((state) => {
          const idArr = castArray(ids);
          idArr.forEach((id) => {
            if (state.suosikitSelection[id]) delete state.suosikitSelection[id];
          });
        }),
      toggleVertailu: (id) =>
        set((state) => {
          if (state.suosikitSelection[id]) {
            state.suosikitSelection[id].compare = !state.suosikitSelection[id].compare;
            if (!state.suosikitSelection[id].compare) {
              state.suosikitSelection[id].haku = false;
            }
          }
        }),
      toggleHaku: (id) =>
        set((state) => {
          if (state.suosikitSelection[id]) {
            state.suosikitSelection[id].haku = !state.suosikitSelection[id].haku;
          }
        }),
    })),
    {
      name: 'favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSuosikitSelection = () => useSuosikitState();

export const useSuosikitCount = () =>
  useSuosikitState((state) => Object.values(state.suosikitSelection).length);

export const useVertailuSuosikit = () =>
  useSuosikitState((state) =>
    toPairs(state.suosikitSelection).reduce(
      (acc, [oid, suosikki]) => (suosikki?.compare ? [...acc, oid] : acc),
      [] as Array<string>
    )
  );

export const useHakuunValitut = () =>
  useSuosikitState((state) =>
    toPairs(state.suosikitSelection).reduce(
      (acc, [oid, suosikki]) => (suosikki?.haku ? [...acc, oid] : acc),
      [] as Array<string>
    )
  );

export const useSuosikitDataOrdered = <T extends { hakukohdeOid: string }>(
  data?: Array<T>
) => {
  const { suosikitSelection } = useSuosikitSelection();

  return useMemo(
    () =>
      orderBy(
        data,
        (suosikkiData) => suosikitSelection[suosikkiData.hakukohdeOid]?.timestamp,
        'desc'
      ),
    [data, suosikitSelection]
  );
};
