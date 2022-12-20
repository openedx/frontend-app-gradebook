/* eslint-disable import/no-extraneous-dependencies */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.LMS_BASE_URL = 'http://localhost:18000';
process.env.SITE_NAME = 'localhost';
process.env.FAVICON_URL = 'http://localhost:18000/favicon.ico';

jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  const PropTypes = jest.requireActual('prop-types');
  return {
    ...i18n,
    intlShape: PropTypes.shape({
      formatMessage: jest.fn(msg => msg.defaultMessage),
    }),
    defineMessages: m => m,
    FormattedMessage: () => 'FormattedMessage',
    getLocale: jest.fn(),
  };
});
