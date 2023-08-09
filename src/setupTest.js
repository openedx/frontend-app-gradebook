/* eslint-disable import/no-extraneous-dependencies */

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.LMS_BASE_URL = 'http://localhost:18000';
process.env.SITE_NAME = 'localhost';
process.env.FAVICON_URL = 'http://localhost:18000/favicon.ico';

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

jest.mock('@edx/paragon/icons', () => ({
  FilterAlt: 'FilterAlt',
  Close: 'Close',
}));

jest.mock('@edx/paragon', () => jest.requireActual('testUtils').mockNestedComponents({
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
