import { screen } from '@testing-library/react';
import { getLocale } from '@edx/frontend-platform/i18n';
import LabelReplacements from './LabelReplacements';
import messages from './messages';
import { renderWithIntl } from '../../../testUtilsExtra';

const {
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
  MastersOnlyLabelReplacement,
} = LabelReplacements;

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  isRtl: jest.fn(),
}));

describe('LabelReplacements', () => {
  describe('TotalGradeLabelReplacement', () => {
    getLocale.mockImplementation(() => 'en');
    renderWithIntl(<TotalGradeLabelReplacement />);
    it('displays overlay tooltip', () => {
      const tooltip = screen.getByText(messages.totalGradePercentage.defaultMessage);
      expect(tooltip).toBeInTheDocument();
    });
  });
  describe('UsernameLabelReplacement', () => {
    it('renders correctly', () => {
      renderWithIntl(<UsernameLabelReplacement />);
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
      renderWithIntl(<MastersOnlyLabelReplacement {...message} />);
      expect(screen.getByText(message.defaultMessage)).toBeInTheDocument();
    });
  });
});
