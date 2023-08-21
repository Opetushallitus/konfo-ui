import { QueryObserverResult } from 'react-query';

export const getCombinedQueryStatus = (responses: Array<QueryObserverResult> = []) => {
  switch (true) {
    case responses.some((res) => res?.status === 'loading'):
      return 'loading';
    case responses.some((res) => res?.status === 'error'):
      return 'error';
    case responses.every((res) => res?.status === 'success'):
      return 'success';
    default:
      return 'idle';
  }
};

export const getCombinedQueryIsFetching = (responses: Array<QueryObserverResult> = []) =>
  responses.some((res) => res?.isFetching);
