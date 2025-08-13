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

jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  const PropTypes = jest.requireActual('prop-types');
  const { formatMessage } = jest.requireActual('./testUtils');
  const formatDate = jest.fn(date => new Date(date).toLocaleDateString()).mockName('useIntl.formatDate');
  return {
    ...i18n,
    intlShape: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
    useIntl: jest.fn(() => ({
      formatMessage,
      formatDate,
    })),
    IntlProvider: () => 'IntlProvider',
    defineMessages: m => m,
    FormattedMessage: () => 'FormattedMessage',
    getLocale: jest.fn(),
  };
});

jest.mock('@edx/frontend-component-header', () => ({
  messages: ['some', 'messages'],
}));
jest.mock('@edx/frontend-component-footer', () => ({
  messages: ['some', 'messages'],
}));

jest.mock('@openedx/paragon/icons', () => ({
  FilterAlt: 'FilterAlt',
  Close: 'Close',
}));

jest.mock('@openedx/paragon', () => jest.requireActual('testUtils').mockNestedComponents({
  Alert: 'Alert',
  ActionRow: 'ActionRow',
  Badge: 'Badge',
  Button: 'Button',
  Collapsible: {
    Advanced: 'Collapsible.Advanced',
    Body: 'Collapsible.Body',
    Trigger: 'Collapsible.Trigger',
    Visible: 'Collapsible.Visible',
  },
  DataTable: {
    EmptyTable: 'DataTable.EmptyTable',
    Table: 'DataTable.Table',
    TableControlBar: 'DataTable.TableControlBar',
    TableController: 'DataTable.TableController',
    TableFooter: 'DataTable.TableFooter',
  },
  Form: {
    Checkbox: 'Form.Checkbox',
    CheckboxSet: 'Form.CheckboxSet',
    Control: {
      Feedback: 'Form.Control.Feedback',
    },
    Group: 'Form.Group',
    Label: 'Form.Label',
    Radio: 'Form.Radio',
    RadioSet: 'Form.RadioSet',
    Switch: 'Form.Switch',
  },
  FormControl: 'FormControl',
  FormGroup: 'FormGroup',
  FormLabel: 'FormLabel',
  Hyperlink: 'Hyperlink',
  Icon: 'Icon',
  IconButton: 'IconButton',
  Input: 'Input',
  ModalDialog: {
    Body: 'ModalDialog.Body',
    CloseButton: 'ModalDialog.CloseButton',
    Header: 'ModalDialog.Header',
    Hero: 'ModalDialog.Hero',
    Footer: 'ModalDialog.Footer',
  },
  OverlayTrigger: 'OverlayTrigger',
  Row: 'Row',
  SearchField: 'SearchField',
  Spinner: 'Spinner',
  StatefulButton: 'StatefulButton',
  Toast: 'Toast',

  useCheckboxSetValues: () => jest.fn().mockImplementation((values) => ([values, {
    add: jest.fn().mockName('useCheckboxSetValues.add'),
    remove: jest.fn().mockName('useCheckboxSetValues.remove'),
  }])),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn((val) => ({ current: val, useRef: true })),
  useCallback: jest.fn((cb, prereqs) => ({ useCallback: { cb, prereqs } })),
  useEffect: jest.fn((cb, prereqs) => ({ useEffect: { cb, prereqs } })),
  useMemo: jest.fn((cb, prereqs) => cb(prereqs)),
  useContext: jest.fn(context => context),
}));
