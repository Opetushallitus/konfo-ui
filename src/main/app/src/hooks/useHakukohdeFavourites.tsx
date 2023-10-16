import { formatISO } from 'date-fns';
import { forEach } from 'lodash';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface HakukohdeFavouriteState {
  hakukohdeFavourites: Record<string, { timestamp: string; removed?: boolean }>;
  toggleFavourite: (id: string) => void;
  softToggleFavourite: (id: string) => void;
  clearSoftRemovedFavourites: () => void;
}

const useFavouriteStore = create<HakukohdeFavouriteState>()(
  persist(
    immer((set) => ({
      hakukohdeFavourites: {},
      toggleFavourite: (id: string) =>
        set((state) => {
          if (state.hakukohdeFavourites[id]) {
            delete state.hakukohdeFavourites[id];
          } else {
            state.hakukohdeFavourites[id] = {
              timestamp: formatISO(new Date()),
            };
          }
        }),
      softToggleFavourite: (id: string) =>
        set((state) => {
          if (state.hakukohdeFavourites[id]) {
            state.hakukohdeFavourites[id].removed =
              !state.hakukohdeFavourites[id].removed;
          }
        }),
      clearSoftRemovedFavourites: () =>
        set((state) => {
          forEach(state.hakukohdeFavourites, (val, oid) => {
            if (val.removed) {
              delete state.hakukohdeFavourites[oid];
            }
          });
        }),
    })),
    {
      name: 'hakukohde-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useHakukohdeFavourites = () => useFavouriteStore();
