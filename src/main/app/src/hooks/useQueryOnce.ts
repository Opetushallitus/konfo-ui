import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

// Load asynchronous data once and then cache it forever
export const useQueryOnce = <T = unknown>(
  key: string | QueryKey,
  fn: QueryFunction<T, QueryKey>,
  options: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery<T>({
    queryKey: typeof key === 'string' ? [key] : key,
    queryFn: fn,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
};
