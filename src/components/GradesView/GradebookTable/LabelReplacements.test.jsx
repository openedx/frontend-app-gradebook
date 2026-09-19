import { screen } from '@testing-library/react';

import { getLocale } from '@openedx/frontend-base';

import { renderWithAllProviders } from '@src/testUtils';
import LabelReplacements from './LabelReplacements';
import messages from './messages';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getLocale: jest.fn(),
  isRtl: jest.fn(),
}));

const {
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
  MastersOnlyLabelReplacement,
} = LabelReplacements;

describe('LabelReplacements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getLocale.mockReturnValue('en');
  });

  describe('TotalGradeLabelReplacement', () => {
    it('renders the total grade heading with the overlay tooltip content', () => {
      renderWithAllProviders(<TotalGradeLabelReplacement />);
      expect(screen.getByText(messages.totalGradeHeading.defaultMessage)).toBeInTheDocument();
    });
  });

  describe('UsernameLabelReplacement', () => {
    it('renders the username heading and student-key label', () => {
      renderWithAllProviders(<UsernameLabelReplacement />);
      expect(screen.getByText(messages.usernameHeading.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.studentKeyLabel.defaultMessage)).toBeInTheDocument();
    });
  });

  describe('MastersOnlyLabelReplacement', () => {
    it('renders the passed message next to the masters-only asterisk', () => {
      const message = {
        id: 'test.masters-only',
        defaultMessage: 'masters only heading',
        description: 'test',
      };
      renderWithAllProviders(<MastersOnlyLabelReplacement {...message} />);
      expect(screen.getByText(message.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });
});
