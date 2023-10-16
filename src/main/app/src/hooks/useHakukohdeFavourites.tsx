import { formatISO } from 'date-fns';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface HakukohdeFavouriteState {
  hakukohdeFavourites: Record<string, { timestamp: string }>;
  addHakukohdeFavourite: (id: string) => void;
  removeHakukohdeFavourite: (id: string) => void;
  toggleHakukohdeFavourite: (id: string) => void;
  clearHakukohdeFavourites: () => void;
}

const useFavouriteStore = create<HakukohdeFavouriteState>()(
  persist(
    immer((set) => ({
      hakukohdeFavourites: {},
      addHakukohdeFavourite: (id: string) =>
        set((state) => {
          state.hakukohdeFavourites[id] = state.hakukohdeFavourites[id] ?? {
            timestamp: formatISO(new Date()),
          };
        }),
      removeHakukohdeFavourite: (id: string) =>
        set((state) => {
          delete state.hakukohdeFavourites[id];
        }),
      toggleHakukohdeFavourite: (id: string) =>
        set((state) => {
          if (state.hakukohdeFavourites[id]) {
            delete state.hakukohdeFavourites[id];
          } else {
            state.hakukohdeFavourites[id] = {
              timestamp: formatISO(new Date()),
            };
          }
        }),
      clearHakukohdeFavourites: () =>
        set((state) => {
          state.hakukohdeFavourites = {};
        }),
    })),
    {
      name: 'hakukohde-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useHakukohdeFavourites = () => useFavouriteStore();
