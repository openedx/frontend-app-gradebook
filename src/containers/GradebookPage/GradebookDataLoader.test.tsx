import { render } from '@testing-library/react';

import { useGrades } from '@src/components/GradesView/data/apiHook';
import { useCourseIdWithGate } from '@src/data/apiHook';
import { useGradebookUi } from '@src/data/gradebookUiContext';

import GradebookDataLoader from './GradebookDataLoader';

jest.mock('@src/components/GradesView/data/apiHook', () => ({
  useGrades: jest.fn(),
}));
jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCourseIdWithGate: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

const useGradesMock = jest.mocked(useGrades);
const useCourseIdWithGateMock = jest.mocked(useCourseIdWithGate);
const useGradebookUiMock = jest.mocked(useGradebookUi);

describe('GradebookDataLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGradesMock.mockReturnValue({});
  });

  it('renders nothing', () => {
    useCourseIdWithGateMock.mockReturnValue({ courseId: 'course-v1:X', enabled: true });
    useGradebookUiMock.mockReturnValue({ gradesPageEndpoint: null });
    const { container } = render(<GradebookDataLoader />);
    expect(container.firstChild).toBeNull();
  });

  it('mounts the grades query gated by useCourseIdWithGate + current pagination cursor', () => {
    useCourseIdWithGateMock.mockReturnValue({ courseId: 'course-v1:X', enabled: false });
    useGradebookUiMock.mockReturnValue({ gradesPageEndpoint: 'https://lms/next' });
    render(<GradebookDataLoader />);
    expect(useGradesMock).toHaveBeenCalledWith(
      'course-v1:X',
      'https://lms/next',
      { enabled: false },
    );
  });
});
