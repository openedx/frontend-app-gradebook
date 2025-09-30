import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { gradebookApp } from './src';

import './src/app.scss';

const siteConfig: SiteConfig = {
  siteId: 'gradebook-dev',
  siteName: 'Gradebook Dev',
  baseUrl: 'http://apps.local.openedx.io:1994',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  basename: '/gradebook',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    gradebookApp
  ],
  externalRoutes: [
    {
      role: 'profile',
      url: 'http://apps.local.openedx.io:1995/profile/'
    },
    {
      role: 'account',
      url: 'http://apps.local.openedx.io:1997/account/'
    },
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    },
    {
      role: 'org.openedx.frontend.role.learnerDashboard',
      url: 'http://apps.local.openedx.io:1996/learner-dashboard'
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
