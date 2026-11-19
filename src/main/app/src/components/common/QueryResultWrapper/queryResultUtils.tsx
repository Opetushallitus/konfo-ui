import { QueryObserverResult } from '@tanstack/react-query';

export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

// Erottaa ladattavan kyselyn (pending + fetching) kyselystä, jota ei ole vielä käynnistetty (pending + idle, esim. enabled: false)
export const getQueryStatus = (res?: QueryObserverResult): QueryStatus | undefined => {
  if (res?.status === 'pending') {
    return res.fetchStatus === 'idle' ? 'idle' : 'loading';
  }
  return res?.status;
};

export const getCombinedQueryStatus = (
  responses: Array<QueryObserverResult> = []
): QueryStatus => {
  const statuses = responses.map(getQueryStatus);
  switch (true) {
    case statuses.some((status) => status === 'loading'):
      return 'loading';
    case statuses.some((status) => status === 'error'):
      return 'error';
    case statuses.every((status) => status === 'success'):
      return 'success';
    default:
      return 'idle';
  }
};

export const getCombinedQueryIsFetching = (responses: Array<QueryObserverResult> = []) =>
  responses.some((res) => res?.isFetching);
