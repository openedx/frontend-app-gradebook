import { App } from '@openedx/frontend-base';
import { appId } from './constants';
import routes from './routes';
import providers from './providers';

const app: App = {
  appId,
  routes,
  providers,
};

export default app;
