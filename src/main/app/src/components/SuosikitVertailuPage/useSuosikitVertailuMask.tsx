import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type SuosikitVertailuMask = {
  kayntiosoite: boolean;
  'sisaanpaasyn-alin-pistemaara': boolean;
  'aloituspaikat-ensisijaiset-hakijat': boolean;
  aloituspaikat: boolean;
  lukiodiplomit: boolean;
  opiskelijoita: boolean;
  kaksoistutkinto: boolean;
  osaamisalat: boolean;
  'urheilijan-amm-koulutus': boolean;
  valintakoe: boolean;
  kielivalikoima: boolean;
};

export interface SuosikitVertailuMaskState {
  mask: SuosikitVertailuMask;
  setMask: (maskChange: Partial<SuosikitVertailuMask>) => void;
}

const useSuosikitVertailuMaskState = create<SuosikitVertailuMaskState>()(
  immer((set) => ({
    mask: {
      kayntiosoite: true,
      'sisaanpaasyn-alin-pistemaara': true,
      'aloituspaikat-ensisijaiset-hakijat': true,
      aloituspaikat: true,
      lukiodiplomit: true,
      opiskelijoita: true,
      kaksoistutkinto: true,
      osaamisalat: true,
      'urheilijan-amm-koulutus': true,
      valintakoe: true,
      kielivalikoima: true,
    },
    setMask: (maskChange) =>
      set((state) => {
        Object.assign(state.mask, maskChange);
      }),
  }))
);

export const useSuosikitVertailuMask = () => useSuosikitVertailuMaskState();
