import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@openedx/frontend-base';

import queryClient from '@src/data/queryClient';

/**
 * Wraps the app subtree in the configured query client (5-minute staleTime, no
 * refetch on focus, no retries on 4xx — see `src/data/queryClient.ts`),
 * shadowing the shell's default client.
 */
// eslint-disable-next-line react/prop-types
const QueryProvider: AppProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const providers: AppProvider[] = [QueryProvider];

export default providers;
