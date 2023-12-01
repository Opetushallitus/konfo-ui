import React from 'react';

import { QueryObserverResult } from 'react-query';

import { getCombinedQueryStatus } from './queryResultUtils';
import { ErrorMessage } from '../ErrorMessage';
import { LoadingCircle, LoadingCircleWrapper } from '../LoadingCircle';

type QueryResultWrapperProps = React.PropsWithChildren<{
  queryResult: QueryObserverResult | Array<QueryObserverResult>;
}>;

type ErrorComponentType = React.ComponentType<{ onRetry?: () => void }>;

type CreateProps = {
  ErrorComponent: ErrorComponentType;
  LoadingWrapper: any;
};

const createQueryResultWrapper =
  ({ ErrorComponent, LoadingWrapper }: CreateProps) =>
  ({ children, queryResult }: QueryResultWrapperProps) => {
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

export const QueryResult = createQueryResultWrapper({
  ErrorComponent: ErrorMessage,
  LoadingWrapper: LoadingCircle,
});
