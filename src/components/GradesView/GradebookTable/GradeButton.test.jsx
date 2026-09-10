import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useGradeData } from '../data/hooks';
import GradeButton from './GradeButton';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCourseIdWithGate: jest.fn(),
  useAssignmentTypes: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useGradeData: jest.fn(),
}));

const entry = { user_id: 2, username: 'Jessie' };
const subsection = {
  attempted: true,
  percent: 0.5,
  score_earned: 5,
  score_possible: 10,
  subsection_name: 'the things we do',
  module_id: 'in-potions',
};

const setup = ({ areGradesFrozen = false } = {}) => {
  const setModalStateFromTable = jest.fn();
  useCourseIdWithGate.mockReturnValue({ courseId: 'test-course', enabled: true });
  useAssignmentTypes.mockReturnValue({ data: { areGradesFrozen } });
  useGradeData.mockReturnValue({ gradeFormat: 'percent' });
  useGradebookUi.mockReturnValue({ setModalStateFromTable });
  renderWithAllProviders(<GradeButton entry={entry} subsection={subsection} />);
  return { setModalStateFromTable };
};

describe('GradeButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders only the label when grades are frozen', () => {
    setup({ areGradesFrozen: true });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    // The `percent` formatter yields `round(percent * 100)` → 50.
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders a clickable grade button when grades are not frozen', () => {
    setup();
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('50');
  });

  it('opens the edit modal with the user entry and subsection on click', async () => {
    const { setModalStateFromTable } = setup();
    await userEvent.click(screen.getByRole('button'));
    expect(setModalStateFromTable).toHaveBeenCalledWith({
      userEntry: entry,
      subsection,
    });
  });
});
