import { configuration } from '../config';
import { getAuthenticatedAPIClient } from '@edx/frontend-auth';

const apiClient = getAuthenticatedAPIClient({
  appBaseUrl: configuration.BASE_URL,
  loginUrl: configuration.LOGIN_URL,
  logoutUrl: configuration.LOGOUT_URL,
  refreshAccessTokenEndpoint: configuration.REFRESH_ACCESS_TOKEN_ENDPOINT,
  accessTokenCookieName: configuration.ACCESS_TOKEN_COOKIE_NAME,
  csrfCookieName: configuration.CSRF_COOKIE_NAME,
});

export default apiClient;
