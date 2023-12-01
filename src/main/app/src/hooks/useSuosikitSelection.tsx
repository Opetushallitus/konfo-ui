import { formatISO } from 'date-fns';
import { forEach, toPairs } from 'lodash';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Suosikki = {
  timestamp: string;
  removed?: boolean;
  compare?: boolean;
  haku?: boolean;
};

export interface SuosikitState {
  suosikitSelection: Record<string, Suosikki>;
  toggleSuosikki: (id: string) => void;
  softToggleSuosikki: (id: string) => void;
  clearSoftRemovedSuosikit: () => void;
  removeSuosikit: (ids: Array<string>) => void;
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
      softToggleSuosikki: (id) =>
        set((state) => {
          if (state.suosikitSelection[id]) {
            state.suosikitSelection[id].removed = !state.suosikitSelection[id].removed;
          }
        }),
      removeSuosikit: (ids) =>
        set((state) => {
          ids.forEach((id) => {
            if (state.suosikitSelection[id]) delete state.suosikitSelection[id];
          });
        }),
      clearSoftRemovedSuosikit: () =>
        set((state) => {
          forEach(state.suosikitSelection, (val, oid) => {
            if (val.removed) {
              delete state.suosikitSelection[oid];
            }
          });
        }),
      toggleVertailu: (id) =>
        set((state) => {
          if (state.suosikitSelection[id]) {
            state.suosikitSelection[id].compare = !state.suosikitSelection[id].compare;
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

export const useNonRemovedSuosikitCount = () =>
  useSuosikitState(
    (state) =>
      Object.values(state.suosikitSelection).filter((suosikki) => !suosikki.removed)
        .length
  );

export const useVertailuSuosikit = () =>
  useSuosikitState((state) =>
    toPairs(state.suosikitSelection).reduce(
      (acc, [oid, suosikki]) => (suosikki?.compare ? [...acc, oid] : acc),
      [] as Array<string>
    )
  );

export const useHakulomakkeelleVietavat = () =>
  useSuosikitState((state) =>
    toPairs(state.suosikitSelection).reduce(
      (acc, [oid, suosikki]) => (suosikki?.haku ? [...acc, oid] : acc),
      [] as Array<string>
    )
  );
