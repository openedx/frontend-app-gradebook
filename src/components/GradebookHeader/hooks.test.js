import {
  useAssignmentTypes,
  useCanViewGradebook,
  useCourseIdWithGate,
  useShowBulkManagement,
} from '@src/data/apiHook';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';

import messages from './messages';
import useGradebookHeaderData from './hooks';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useAssignmentTypes: jest.fn(),
  useCanViewGradebook: jest.fn(),
  useCourseIdWithGate: jest.fn(),
  useShowBulkManagement: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

const primeMocks = ({
  activeView = views.grades,
  areGradesFrozen = false,
  canView = true,
  showBulkManagement = false,
} = {}) => {
  const setActiveView = jest.fn();
  useGradebookUi.mockReturnValue({ activeView, setActiveView });
  useCourseIdWithGate.mockReturnValue({ courseId: 'test-course', enabled: canView });
  useAssignmentTypes.mockReturnValue({ data: { areGradesFrozen } });
  useCanViewGradebook.mockReturnValue(canView);
  useShowBulkManagement.mockReturnValue(showBulkManagement);
  return { setActiveView };
};

describe('useGradebookHeaderData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards courseId, areGradesFrozen, canView, and showBulkManagement', () => {
    primeMocks({ areGradesFrozen: true, canView: true, showBulkManagement: true });
    const out = useGradebookHeaderData();
    expect(out.courseId).toBe('test-course');
    expect(out.areGradesFrozen).toBe(true);
    expect(out.canUserViewGradebook).toBe(true);
    expect(out.showBulkManagement).toBe(true);
  });

  it('sets the toggle message to `toActivityLog` when the grades view is active', () => {
    primeMocks({ activeView: views.grades });
    const out = useGradebookHeaderData();
    expect(out.toggleViewMessage).toBe(messages.toActivityLog);
  });

  it('sets the toggle message to `toGradesView` when the bulk-management view is active', () => {
    primeMocks({ activeView: views.bulkManagementHistory });
    const out = useGradebookHeaderData();
    expect(out.toggleViewMessage).toBe(messages.toGradesView);
  });

  it('switches to bulk-management view from the grades view on toggle click', () => {
    const { setActiveView } = primeMocks({ activeView: views.grades });
    useGradebookHeaderData().handleToggleViewClick();
    expect(setActiveView).toHaveBeenCalledWith(views.bulkManagementHistory);
  });

  it('switches back to the grades view from bulk-management on toggle click', () => {
    const { setActiveView } = primeMocks({ activeView: views.bulkManagementHistory });
    useGradebookHeaderData().handleToggleViewClick();
    expect(setActiveView).toHaveBeenCalledWith(views.grades);
  });
});
