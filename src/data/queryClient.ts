import { QueryClient } from '@tanstack/react-query';

/**
 * Shape of the subset of an Axios-style error we inspect to decide retries.
 * We only need the HTTP status, so we avoid a hard dependency on axios types.
 */
interface HttpErrorLike {
  response?: { status?: number };
}

/**
 * isClientError(error)
 * True for 4xx responses, which are not worth retrying (bad request, auth,
 * not found, etc.). Server (5xx) and network errors remain retryable.
 */
const isClientError = (error: unknown): boolean => {
  const status = (error as HttpErrorLike)?.response?.status;
  return typeof status === 'number' && status >= 400 && status < 500;
};

/**
 * Application-wide React Query client.
 *
 * `@edx/frontend-platform`'s `AppProvider` does not supply a
 * `QueryClientProvider` (unlike the `@openedx/frontend-base` shell used by the
 * reference apps), so the gradebook owns and mounts this client itself.
 *
 * Defaults are promoted here (rather than repeated per hook) to keep individual
 * query hooks lean: cache server data for 5 minutes and skip retries on 4xx.
 */
export const makeQueryClient = (): QueryClient => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown) => {
        if (isClientError(error)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const queryClient = makeQueryClient();

export default queryClient;
