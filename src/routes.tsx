import { authenticatedLoader } from '@openedx/frontend-base';

const routes = [
  {
    id: 'org.openedx.frontend.route.gradebook.main',
    path: '/gradebook/:courseId',
    loader: authenticatedLoader,
    async lazy() {
      const { default: Main } = await import('./Main');
      return { Component: Main };
    },
    handle: {
      roles: ['org.openedx.frontend.role.gradebook'],
    },
  },
];

export default routes;
