import {
  EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp
} from '@openedx/frontend-base';

import { gradebookApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'gradebook-dev',
  siteName: 'Gradebook Dev',
  baseUrl: 'http://apps.local.openedx.io:1994',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',
  environment: EnvironmentTypes.DEVELOPMENT,
  basename: '/gradebook',
  segmentKey: 'your-segment-key',
  headerLogoImageUrl: '',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    gradebookApp,
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
