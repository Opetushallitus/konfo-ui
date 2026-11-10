import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

import { getOppilaitosTarjonta } from '#/src/api/konfoApi';
import { reducer } from '#/src/store/reducers';
import { usePreviousPage } from '#/src/store/reducers/appSlice';
import { renderHook, waitFor } from '#/src/test-utils';

import { usePaginatedTarjonta } from './hooks';

vi.mock('#/src/api/konfoApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/src/api/konfoApi')>()),
  getOppilaitosTarjonta: vi.fn(() => Promise.resolve({ hits: [], total: 0 })),
}));

vi.mock('#/src/store/reducers/appSlice', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/src/store/reducers/appSlice')>()),
  usePreviousPage: vi.fn(),
}));

const INHERITED_RAJAIMET = {
  jotpa: true,
  tyovoimakoulutus: true,
  taydennyskoulutus: true,
  pieniosaamiskokonaisuus: true,
  apuraha: true,
};

const renderTarjonta = (previousPage: string) => {
  vi.mocked(usePreviousPage).mockReturnValue(previousPage);
  const initialState = reducer(undefined, { type: '@@INIT' });
  const store = configureStore({
    reducer,
    preloadedState: {
      ...initialState,
      hakutulos: { ...initialState.hakutulos, ...INHERITED_RAJAIMET },
      oppilaitos: {
        ...initialState.oppilaitos,
        rajainValues: { ...initialState.oppilaitos.rajainValues, toimipiste: ['1.2.3'] },
      },
    },
  });
  const queryClient = new QueryClient();
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
  return renderHook(
    () => usePaginatedTarjonta({ oid: '1.2.246', isOppilaitosOsa: false }),
    { wrapper }
  );
};

describe('usePaginatedTarjonta', () => {
  beforeEach(() => {
    vi.mocked(getOppilaitosTarjonta).mockClear();
  });

  test('inherits rajaimet from haku page and clears previous toimipiste', async () => {
    const { result } = renderTarjonta('haku');

    await waitFor(() =>
      expect(result.current.rajainValues).toMatchObject(INHERITED_RAJAIMET)
    );
    expect(result.current.rajainValues?.toimipiste).toEqual([]);
    await waitFor(() =>
      expect(getOppilaitosTarjonta).toHaveBeenLastCalledWith({
        oid: '1.2.246',
        requestParams: expect.objectContaining({
          jotpa: 'true',
          tyovoimakoulutus: 'true',
          taydennyskoulutus: 'true',
          pieniosaamiskokonaisuus: 'true',
          apuraha: 'true',
        }),
      })
    );
  });

  test('keeps own rajaimet when coming from another page', async () => {
    const { result } = renderTarjonta('toteutus');

    await waitFor(() => expect(result.current.queryResult.isSuccess).toBe(true));
    expect(result.current.rajainValues).toMatchObject({
      jotpa: false,
      toimipiste: ['1.2.3'],
    });
  });
});
