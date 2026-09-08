/**
 * Shared test helpers. Keeping the provider wrappers here (rather than repeating
 * them in every suite) keeps individual tests focused on behavior.
 *
 * Global jest setup stays in `setupTest.tsx`.
 *
 * The `renderWithAllProviders` wrapper is the gradebook-specific variant of
 * admin-console's helper: it adds the app-scoped `FiltersProvider` and
 * `GradebookUiProvider` contexts around the shared shell providers so component
 * trees that read filter/UI state render without extra wiring in each test.
 */
import {
  ReactElement, ReactNode, FunctionComponent,
} from 'react';
import {
  getSiteConfig, initializeMockApp, IntlProvider, SiteContext,
} from '@openedx/frontend-base';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

import { FiltersProvider } from '@src/data/filtersContext';
import { GradebookUiProvider } from '@src/data/gradebookUiContext';

/**
 * Returns the mocked `getAuthenticatedHttpClient`. Only meaningful in suites that
 * `jest.mock('@openedx/frontend-base', ...)`; lazy so the per-file mock (hoisted
 * above imports) is in effect by the time this is called.
 */
export const mockHttpClient = (): jest.Mock => (
  jest.requireMock('@openedx/frontend-base').getAuthenticatedHttpClient
);

/** The standard authenticated user used across tests. */
export const authenticatedUser = {
  userId: 3,
  username: 'abc123',
  email: 'abc123@example.com',
  name: 'Test User',
  administrator: true,
  roles: [],
  avatar: '',
};

/**
 * Initializes the mock app with the standard authenticated test user. Call this
 * in `beforeEach`/`beforeAll` instead of repeating the user object in each suite.
 * Pass `user` to override.
 */
export function initializeMocks({ user = authenticatedUser } = {}) {
  initializeMockApp({ authenticatedUser: user });
  jest.clearAllMocks();
}

/** Value provided to `SiteContext` in tests. */
export const mockAppContext = {
  authenticatedUser,
  siteConfig: getSiteConfig(),
  locale: 'en',
};

interface WrapperProps {
  children: ReactNode;
}

/**
 * Builds a `renderHook` wrapper that provides a React Query client. Pass an
 * existing client when the test needs to inspect it (e.g. spy on invalidation).
 */
export function createQueryClientWrapper(
  client?: QueryClient,
): FunctionComponent<WrapperProps> {
  const queryClient = client ?? new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const QueryClientWrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return QueryClientWrapper;
}

/**
 * Render with React Query + Router + SiteContext + Intl + the app-scoped
 * `FiltersProvider` and `GradebookUiProvider`. This is the wrapper the vast
 * majority of gradebook component tests need.
 */
export const renderWithAllProviders = (ui: ReactElement, options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SiteContext.Provider value={mockAppContext}>
          <IntlProvider locale="en">
            <FiltersProvider>
              <GradebookUiProvider>
                {children}
              </GradebookUiProvider>
            </FiltersProvider>
          </IntlProvider>
        </SiteContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/** Render with Router + SiteContext + Intl (no React Query, no gradebook contexts). */
export const renderWrapper = (ui: ReactElement, options = {}) => {
  const Wrapper = ({ children }: WrapperProps) => (
    <BrowserRouter>
      <SiteContext.Provider value={mockAppContext}>
        <IntlProvider locale="en">{children}</IntlProvider>
      </SiteContext.Provider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/** IntlProvider-only wrapper, for `renderHook`/simple cases. */
export const intlWrapper = ({ children }: WrapperProps) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);
