import {
  DefaultError, useQuery, UseQueryOptions, UseQueryResult,
} from '@tanstack/react-query';

/** Subset of an Axios-style error we inspect, to avoid depending on axios types. */
interface HttpErrorLike {
  response?: { status?: number };
}

const isClientError = (error: unknown): boolean => {
  const status = (error as HttpErrorLike)?.response?.status;
  return typeof status === 'number' && status >= 400 && status < 500;
};

export const retryUnlessClientError = (failureCount: number, error: unknown): boolean => {
  if (isClientError(error)) {
    return false;
  }
  return failureCount < 3;
};

export const gradebookQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  retry: retryUnlessClientError,
} as const;

/**
 * These can't be defaults on a QueryClient: app providers wrap the whole site,
 * so an app-owned client would impose them on every other app sharing it. The
 * shell's client sets no defaults, so a query that skips this wrapper silently
 * falls back to stock React Query behavior.
 */
export function useGradebookQuery<TQueryFnData, TError = DefaultError, TData = TQueryFnData>(
  options: UseQueryOptions<TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> {
  return useQuery<TQueryFnData, TError, TData>({ ...gradebookQueryOptions, ...options });
}
