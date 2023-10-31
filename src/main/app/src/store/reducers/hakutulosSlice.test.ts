import { expect } from 'vitest';

import { store } from '#/src/store';
import { SearchParams } from '#/src/types/common';

import { urlParamsChanged } from './hakutulosSlice';

type Params = {
  keyword?: string;
  search: Partial<Omit<{ [k in keyof NonNullable<SearchParams>]: string }, 'keyword'>>;
};

const DEFAULT_PARAMS = {
  keyword: 'auto',
  search: {
    koulutusala: 'koulutusala_1,koulutusala_2',
    koulutustyyppi: 'amk,yo',
    opetuskieli: 'opetuskieli_1,opetuskieli_2',
    opetusaika: 'opetusaika_1,opetusaika_2',
    kunta: 'kunta_1,kunta_2',
    maakunta: 'maakunta_1,maakunta_2',
    opetustapa: 'opetustapa_1,opetustapa_2',
    valintatapa: 'valintatapa_1,valintatapa_2',
    hakukaynnissa: 'true',
    jotpa: 'true',
    tyovoimakoulutus: 'true',
    taydennyskoulutus: 'true',
    hakutapa: 'hakutapa_1,hakutapa_2',
    yhteishaku: '1234,5678',
    pohjakoulutusvaatimus: 'pohjakoulutusvaatimus_1,pohjakoulutusvaatimus_2',
    lukiopainotukset: 'lukiopainotukset_1,lukiopainotukset_2',
    lukiolinjaterityinenkoulutustehtava: 'lukiolinja_1,lukiolinja_2',
    osaamisala: 'osaamisala_1,osaamisala_2',
    koulutuksenkestokuukausina_min: '10',
    koulutuksenkestokuukausina_max: '20',
    maksullisuustyyppi: 'maksullinen,lukuvuosimaksu',
    maksunmaara_min: '10',
    maksunmaara_max: '20',
    lukuvuosimaksunmaara_min: '10',
    lukuvuosimaksunmaara_max: '20',
    apuraha: 'false',
    alkamiskausi: '2022-kevat,2022-syksy',
    oppilaitos: '8888,9999',
    hakualkaapaivissa: '30',
  },
} as Params;

const DEFAULT_RESULT = {
  keyword: 'auto',
  koulutusala: ['koulutusala_1', 'koulutusala_2'],
  koulutustyyppi: ['amk', 'yo'],
  opetuskieli: ['opetuskieli_1', 'opetuskieli_2'],
  opetusaika: ['opetusaika_1', 'opetusaika_2'],
  kunta: ['kunta_1', 'kunta_2'],
  maakunta: ['maakunta_1', 'maakunta_2'],
  opetustapa: ['opetustapa_1', 'opetustapa_2'],
  valintatapa: ['valintatapa_1', 'valintatapa_2'],
  hakukaynnissa: true,
  jotpa: true,
  tyovoimakoulutus: true,
  taydennyskoulutus: true,
  hakutapa: ['hakutapa_1', 'hakutapa_2'],
  yhteishaku: ['1234', '5678'],
  pohjakoulutusvaatimus: ['pohjakoulutusvaatimus_1', 'pohjakoulutusvaatimus_2'],
  lukiopainotukset: ['lukiopainotukset_1', 'lukiopainotukset_2'],
  lukiolinjaterityinenkoulutustehtava: ['lukiolinja_1', 'lukiolinja_2'],
  osaamisala: ['osaamisala_1', 'osaamisala_2'],
  koulutuksenkestokuukausina: {
    koulutuksenkestokuukausina_min: '10',
    koulutuksenkestokuukausina_max: '20',
  },
  maksullisuustyyppi: ['lukuvuosimaksu', 'maksullinen'],
  maksunmaara: {
    maksunmaara_min: '10',
    maksunmaara_max: '20',
  },
  lukuvuosimaksunmaara: {
    lukuvuosimaksunmaara_min: '10',
    lukuvuosimaksunmaara_max: '20',
  },
  apuraha: false,
  alkamiskausi: ['2022-kevat', '2022-syksy'],
  oppilaitos: ['8888', '9999'],
  hakualkaapaivissa: ['30'],
};

describe('urlParamsChanged', () => {
  it('should update known params', () => {
    store.dispatch(urlParamsChanged(DEFAULT_PARAMS));
    const state = store.getState();

    expect(state.hakutulos).toMatchObject(DEFAULT_RESULT);
  });

  it("shouldn't update unknown params", () => {
    store.dispatch(
      urlParamsChanged({
        search: {
          tuntematon: 'a,b',
          jotain_min: '10',
          jotain_max: '20',
        },
      })
    );
    const state: any = store.getState();
    expect(state.hakutulos.tuntematon).toBeUndefined();
    expect(state.hakutulos.jotain).toBeUndefined();
    expect(state.hakutulos.jotain_min).toBeUndefined();
    expect(state.hakutulos.jotain_max).toBeUndefined();
  });

  it("shouldn't update unchanged params", () => {
    store.dispatch(urlParamsChanged(DEFAULT_PARAMS));
    const state1: any = store.getState();

    store.dispatch(urlParamsChanged(DEFAULT_PARAMS));
    const state2: any = store.getState();

    Object.keys(DEFAULT_RESULT).forEach((k) => {
      expect(state1.hakutulos[k]).toBe(state2.hakutulos[k]);
    });
  });
});
