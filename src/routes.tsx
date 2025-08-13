import Main from './Main';
import { GradebookPage } from './containers/GradebookPage';

const routes = [
  {
    id: 'org.openedx.frontend.route.gradebook.main',
    path: '/',
    Component: Main,
    children: [
      {
        path: '',
        element: (<GradebookPage />)
      },
      {
        path: ':id',
        element: (<GradebookPage />)
      },
    ]
  },
];

export default routes;
