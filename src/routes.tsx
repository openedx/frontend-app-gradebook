import { lazy } from 'react';
import { authenticatedLoader } from '@openedx/frontend-base';

const Main = lazy(() => import('./Main'));

const routes = [
  {
    id: 'org.openedx.frontend.route.gradebook.main',
    path: '/:courseId',
    loader: authenticatedLoader,
    Component: Main,
    handle: {
      roles: ['org.openedx.frontend.role.gradebook'],
    },
  },
];

export default routes;
