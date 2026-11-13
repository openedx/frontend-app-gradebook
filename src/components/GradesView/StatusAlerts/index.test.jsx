import { screen, within } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import {
  useAssignmentGradeFilterValidity,
  useCourseGradeFilterValidity,
} from '@src/components/GradebookFilters/data/hooks';
import { useSelectedAssignmentLabel } from '@src/components/GradesView/data/hooks';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import StatusAlerts from '.';
import messages from './messages';

jest.mock('@src/components/GradebookFilters/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradebookFilters/data/hooks'),
  useAssignmentGradeFilterValidity: jest.fn(),
  useCourseGradeFilterValidity: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useSelectedAssignmentLabel: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

const valid = { isMinValid: true, isMaxValid: true, isRangeValid: true };

describe('StatusAlerts', () => {
  const setShowSuccess = jest.fn();

  const setup = ({
    assignmentValidity = valid,
    courseValidity = valid,
    selectedAssignment = 'test-assignment',
    showSuccess = false,
  } = {}) => {
    useAssignmentGradeFilterValidity.mockReturnValue(assignmentValidity);
    useCourseGradeFilterValidity.mockReturnValue(courseValidity);
    useSelectedAssignmentLabel.mockReturnValue(selectedAssignment);
    useGradebookUi.mockReturnValue({ showSuccess, setShowSuccess });
    return renderWithAllProviders(<StatusAlerts />);
  };
  const gradeFilterLines = () => within(screen.getByRole('alert')).getAllByText(/./)
    .map((line) => line.textContent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the success banner when showSuccess is true', () => {
    setup({ showSuccess: true });
    const alerts = screen.getAllByRole('alert');
    expect(alerts[0]).toHaveClass('alert-success');
  });

  it('hides the success banner when showSuccess is false', () => {
    setup({ showSuccess: false });
    expect(screen.queryByText(/successfully edited/i)).not.toBeInTheDocument();
  });

  it('shows no grade filter alert when all limits are valid', () => {
    setup();
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it.each([
    ['course min is invalid', valid, { ...valid, isMinValid: false }, ['minGradeInvalid']],
    ['course min and max are invalid', valid, { ...valid, isMinValid: false, isMaxValid: false }, ['minGradeInvalid', 'maxGradeInvalid']],
    ['course min is greater than max', valid, { ...valid, isRangeValid: false }, ['courseGradeRangeInvalid']],
    ['assignment min is invalid', { ...valid, isMinValid: false }, valid, ['minAssignmentGradeInvalid']],
    ['assignment max is invalid', { ...valid, isMaxValid: false }, valid, ['maxAssignmentGradeInvalid']],
    ['assignment min is greater than max', { ...valid, isRangeValid: false }, valid, ['assignmentGradeRangeInvalid']],
    ['assignment and course limits are invalid', { ...valid, isMinValid: false }, { ...valid, isMaxValid: false }, ['minAssignmentGradeInvalid', 'maxGradeInvalid']],
  ])('when %s, lists each error on its own line', (_, assignmentValidity, courseValidity, expected) => {
    setup({ assignmentValidity, courseValidity });
    expect(gradeFilterLines()).toEqual(expected.map((key) => messages[key].defaultMessage));
  });

  it('ignores invalid assignment limits when no assignment is selected', () => {
    setup({ assignmentValidity: { ...valid, isMinValid: false }, selectedAssignment: null });
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });
});
