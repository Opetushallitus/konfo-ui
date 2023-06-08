import React from 'react';

import { QueryObserverResult } from 'react-query';

import { ErrorMessage } from './ErrorMessage';
import { LoadingCircleWrapper } from './LoadingCircle';

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

type ErrorComponentType = React.ComponentType<{ onRetry?: () => void }>;

type CreateProps = {
  ErrorComponent: ErrorComponentType;
  LoadingWrapper: any;
};

type Props = React.PropsWithChildren<{
  queryResult: QueryObserverResult | Array<QueryObserverResult>;
}>;

export const createQueryResultWrapper =
  ({ ErrorComponent, LoadingWrapper }: CreateProps) =>
  ({ children, queryResult }: Props) => {
    let status, isFetching, errors, refetch;
    if (Array.isArray(queryResult)) {
      status = getCombinedQueryStatus(queryResult);
      isFetching = queryResult.some((result) => result.isFetching);
      errors = queryResult?.map(({ error }) => error).filter(Boolean);
      refetch = () => queryResult.forEach((result) => result.refetch());
    } else {
      status = queryResult?.status;
      isFetching = queryResult?.isFetching;
      errors = queryResult?.error ? [queryResult?.error] : undefined;
      refetch = queryResult?.refetch;
    }

    if (isFetching) {
      return <LoadingWrapper>{children}</LoadingWrapper>;
    }

    switch (status) {
      case 'idle':
        return <div></div>;
      case 'success':
        return children ? <>{children}</> : <div></div>;
      case 'error':
        console.error(errors);
        return <ErrorComponent onRetry={refetch} />;
      case 'loading':
      default:
        return <LoadingWrapper>{children}</LoadingWrapper>;
    }
  };

export const QueryResultWrapper = createQueryResultWrapper({
  ErrorComponent: ErrorMessage,
  LoadingWrapper: LoadingCircleWrapper,
});
