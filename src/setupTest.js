import '@testing-library/jest-dom';

export const mockConfigs = {
  SITE_NAME: 'test-site-name',
  FAVICON_URL: 'http://localhost:18000/favicon.ico',
  LMS_BASE_URL: 'http://localhost:18000',
};
// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
// many are here to prevent warnings on the tests
process.env.LMS_BASE_URL = mockConfigs.LMS_BASE_URL;
process.env.SITE_NAME = mockConfigs.SITE_NAME;
process.env.FAVICON_URL = mockConfigs.FAVICON_URL;
process.env.BASE_URL = mockConfigs.LMS_BASE_URL;
process.env.LOGIN_URL = `${mockConfigs.LMS_BASE_URL}/login`;
process.env.LOGOUT_URL = `${mockConfigs.LMS_BASE_URL}/logout`;
process.env.REFRESH_ACCESS_TOKEN_ENDPOINT = `${mockConfigs.LMS_BASE_URL}/refresh_access_token`;
process.env.ACCESS_TOKEN_COOKIE_NAME = 'edx';
process.env.CSRF_TOKEN_API_PATH = 'TOKEN_PATH';
