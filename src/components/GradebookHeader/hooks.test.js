import { views } from 'data/constants/app';
import { actions, selectors } from 'data/redux/hooks';

import messages from './messages';
import useGradebookHeaderData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: {
      useSetView: jest.fn(),
    },
  },
  selectors: {
    app: {
      useActiveView: jest.fn(),
      useCourseId: jest.fn(),
    },
    assignmentTypes: {
      useAreGradesFrozen: jest.fn(),
    },
    roles: {
      useCanUserViewGradebook: jest.fn(),
    },
    root: {
      useShowBulkManagement: jest.fn(),
    },
  },
}));

const activeView = 'test-active-view';
selectors.app.useActiveView.mockReturnValue(activeView);
const courseId = 'test-course-id';
selectors.app.useCourseId.mockReturnValue(courseId);
const areGradesFrozen = 'test-are-grades-frozen';
selectors.assignmentTypes.useAreGradesFrozen.mockReturnValue(areGradesFrozen);
const canUserViewGradebook = 'test-can-user-view-gradebook';
selectors.roles.useCanUserViewGradebook.mockReturnValue(canUserViewGradebook);
const showBulkManagement = 'test-show-bulk-management';
selectors.root.useShowBulkManagement.mockReturnValue(showBulkManagement);

const setView = jest.fn();
actions.app.useSetView.mockReturnValue(setView);

let out;
describe('useGradebookHeaderData hooks', () => {
  describe('initialization', () => {
    it('initializes redux hooks', () => {
      out = useGradebookHeaderData();
      expect(selectors.app.useActiveView).toHaveBeenCalled();
      expect(selectors.app.useCourseId).toHaveBeenCalled();
      expect(selectors.assignmentTypes.useAreGradesFrozen).toHaveBeenCalled();
      expect(selectors.roles.useCanUserViewGradebook).toHaveBeenCalled();
      expect(selectors.root.useShowBulkManagement).toHaveBeenCalled();
      expect(actions.app.useSetView).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    test('redux fields', () => {
      out = useGradebookHeaderData();
      expect(out.areGradesFrozen).toEqual(areGradesFrozen);
      expect(out.canUserViewGradebook).toEqual(canUserViewGradebook);
      expect(out.courseId).toEqual(courseId);
      expect(out.showBulkManagement).toEqual(showBulkManagement);
    });
    describe('handleToggleViewClick', () => {
      it('calls setView with bulkManagemnetHistory message if grades view is active', () => {
        selectors.app.useActiveView.mockReturnValueOnce(views.grades);
        out = useGradebookHeaderData();
        out.handleToggleViewClick();
        expect(setView).toHaveBeenCalledWith(views.bulkManagementHistory);
      });
      it('calls setView with grades view if grades view is not active', () => {
        out = useGradebookHeaderData();
        out.handleToggleViewClick();
        expect(setView).toHaveBeenCalledWith(views.grades);
      });
    });
    describe('toggleViewMessage', () => {
      it('returns toActivityLog message if grades view is active', () => {
        selectors.app.useActiveView.mockReturnValueOnce(views.grades);
        out = useGradebookHeaderData();
        expect(out.toggleViewMessage).toEqual(messages.toActivityLog);
      });
      it('returns toGradesView message if grades view is not active', () => {
        out = useGradebookHeaderData();
        expect(out.toggleViewMessage).toEqual(messages.toGradesView);
      });
    });
  });
});
