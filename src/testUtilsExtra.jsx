/* eslint-disable import/no-extraneous-dependencies */

// This a file with extra things required for being able to mock services etc...
// Normally this is on the `testUtils`file, but given the current state of the tests
// It creates a non trivial circular dependency, which is avoided by not having the
// mocks that currently exists on testUtils, and that will be gone after the DEPR of react-unit-test-utils
// so to wrapup the migration this file needs to be integrated in testUtils as the last step.
import React from 'react';
import PropTypes from 'prop-types';
import {
  MemoryRouter, Route, Routes, generatePath,
} from 'react-router';
import { AppProvider } from '@edx/frontend-platform/react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import { createStore } from './data/store';

/** @deprecated Use React Query and/or regular React Context instead of redux */
let reduxStore;

/**
 * This component works together with the custom `render()` method we have in
 * this file to provide whatever react-router context you need for your
 * component.
 *
 * In the simplest case, you don't need to worry about the router at all, so
 * just render your component using `render(<TheComponent />)`.
 *
 * The next simplest way to use it is to specify `path` (the route matching rule
 * that is normally used to determine when to show the component or its parent
 * page) and `params` like this:
 *
 * ```
 * render(<LibraryLayout />, { path: '/library/:libraryId/*', params: { libraryId: 'lib:Axim:testlib' } });
 * ```
 *
 * In this case, components that use the `useParams` hook will get the right
 * library ID, and we don't even have to mock anything.
 *
 * In other cases, such as when you have routes inside routes, you'll need to
 * set the router's `initialEntries` (URL history) prop yourself, like this:
 *
 * ```
 * render(<LibraryLayout />, {
 *   path: '/library/:libraryId/*',
 *   // The root component is mounted on the above path, as it is in the "real"
 *   // MFE. But to access the 'settings' sub-route/component for this test, we
 *   // need tospecify the URL like this:
 *   routerProps: { initialEntries: [`/library/${libraryId}/settings`] },
 * });
 * ```
 */
const RouterAndRoute = ({
  children,
  path = '/',
  params = {},
  routerProps = {},
}) => {
  if (Object.entries(params).length > 0 || path !== '/') {
    const newRouterProps = { ...routerProps };
    if (!routerProps.initialEntries) {
      // Substitute the params into the URL so '/library/:libraryId' becomes '/library/lib:org:123'
      let pathWithParams = generatePath(path, params);
      if (pathWithParams.endsWith('/*')) {
        // Some routes (that contain child routes) need to end with /* in the <Route> but not in the router
        pathWithParams = pathWithParams.substring(0, pathWithParams.length - 1);
      }
      newRouterProps.initialEntries = [pathWithParams];
    }
    return (
      <MemoryRouter {...newRouterProps}>
        <Routes>
          <Route path={path} element={children} />
        </Routes>
      </MemoryRouter>
    );
  }
  return (
    <MemoryRouter {...routerProps}>{children}</MemoryRouter>
  );
};

RouterAndRoute.propTypes = {
  children: PropTypes.node,
  path: PropTypes.string,
  params: PropTypes.shape({}),
  routerProps: PropTypes.shape({}),
};

export const makeWrapper = ({ extraWrapper, ...routeArgs } = {}) => {
  // eslint-disable-next-line react/prop-types
  const AllTheProviders = ({ children }) => (
    <AppProvider store={reduxStore} wrapWithRouter={false}>
      <IntlProvider locale="en" messages={{}}>
        <RouterAndRoute {...routeArgs}>
          {extraWrapper ? React.createElement(extraWrapper, undefined, children) : children}
        </RouterAndRoute>
      </IntlProvider>
    </AppProvider>
  );
  return AllTheProviders;
};

/**
 * Same as render() from `@testing-library/react` but this one provides all the
 * wrappers our React components need to render properly.
 */
function customRender(ui, options = {}) {
  return render(ui, { wrapper: makeWrapper(options) });
}

const defaultUser = {
  userId: 3,
  username: 'abc123',
  administrator: true,
  roles: [],
};

/**
 * Initialize common mocks that many of our React components will require.
 *
 * This should be called within each test case, or in `beforeEach()`.
 *
 * Returns the new `axiosMock` in case you need to mock out axios requests.
 */
export function initializeMocks({ user = defaultUser, initialState = undefined } = {}) {
  initializeMockApp({
    authenticatedUser: user,
  });
  reduxStore = createStore(initialState);

  // Clear the call counts etc. of all mocks. This doesn't remove the mock's effects; just clears their history.
  jest.clearAllMocks();

  return {
    reduxStore,
  };
}

export * from '@testing-library/react';
export {
  customRender as render,
};
