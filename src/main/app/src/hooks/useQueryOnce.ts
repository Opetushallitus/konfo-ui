import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from 'react-query';

// Load asynchronous data once and then cache it forever
export const useQueryOnce = <T = unknown>(
  key: QueryKey,
  fn: QueryFunction<T, QueryKey>,
  options: UseQueryOptions<T> = {}
) => {
  return useQuery<T>(key, fn, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
};
