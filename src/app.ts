import { App } from '@openedx/frontend-base';
import { appId } from './constants';
import routes from './routes';
import slots from './slots';

const app: App = {
  appId,
  routes,
  slots,
};

export default app;
