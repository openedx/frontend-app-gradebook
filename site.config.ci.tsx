import {
  EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp,
} from '@openedx/frontend-base';

import { gradebookApp } from './src';

const siteConfig: SiteConfig = {
  siteId: 'gradebook-ci',
  siteName: 'Gradebook CI',
  baseUrl: 'http://localhost:1994',
  lmsBaseUrl: 'http://localhost:8000',
  loginUrl: 'http://localhost:8000/login',
  logoutUrl: 'http://localhost:8000/logout',

  environment: EnvironmentTypes.PRODUCTION,
  basename: '/gradebook',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    gradebookApp,
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
