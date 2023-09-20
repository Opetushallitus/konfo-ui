import { store } from '#/src/store';

import { urlParamsChanged } from './hakutulosSlice';

describe('urlParamsChanged', () => {
  test.each([
    {
      search: {
        hakukaynnissa: 'true',
        jotpa: 'true',
        tyovoimakoulutus: 'true',
        taydennyskoulutus: 'true',
        apuraha: 'true',
        koulutustyyppi: 'amk,yo',
      },
    },
  ])('urlParamsChanged', (payload) => {
    store.dispatch(urlParamsChanged(payload));
    const state = store.getState();

    expect(state.hakutulos).toMatchObject({
      hakukaynnissa: true,
      jotpa: true,
      tyovoimakoulutus: true,
      taydennyskoulutus: true,
      apuraha: true,
      koulutustyyppi: ['amk', 'yo'],
    });
  });
});
