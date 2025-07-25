import { render, screen } from '@testing-library/react';
import { getLocale, IntlProvider } from '@edx/frontend-platform/i18n';
import LabelReplacements from './LabelReplacements';
import messages from './messages';

const {
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
  MastersOnlyLabelReplacement,
} = LabelReplacements;

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  isRtl: jest.fn(),
}));

describe('LabelReplacements', () => {
  describe('TotalGradeLabelReplacement', () => {
    getLocale.mockImplementation(() => 'en');
    render(<IntlProvider locale="en"><TotalGradeLabelReplacement /></IntlProvider>);
    it('displays overlay tooltip', () => {
      const tooltip = screen.getByText(messages.totalGradePercentage.defaultMessage);
      expect(tooltip).toBeInTheDocument();
    });
  });
  describe('UsernameLabelReplacement', () => {
    it('renders correctly', () => {
      render(<IntlProvider locale="en"><UsernameLabelReplacement /></IntlProvider>);
      expect(screen.getByText(messages.usernameHeading.defaultMessage)).toBeInTheDocument();
    });
  });
  describe('MastersOnlyLabelReplacement', () => {
    it('renders correctly', () => {
      const message = {
        id: 'id',
        defaultMessage: 'defaultMessAge',
        description: 'desCripTion',
      };
      render(<IntlProvider locale="en"><MastersOnlyLabelReplacement {...message} /></IntlProvider>);
      expect(screen.getByText(message.defaultMessage)).toBeInTheDocument();
    });
  });
});
