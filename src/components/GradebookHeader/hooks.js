import { views } from 'data/constants/app';
import {
  useAssignmentTypes,
  useCanViewGradebook,
  useCourseIdWithGate,
  useShowBulkManagement,
} from 'data/apiHook';
import { useGradebookUi } from 'data/gradebookUiContext';

import messages from './messages';

export const useGradebookHeaderData = () => {
  const { activeView, setActiveView } = useGradebookUi();
  const { courseId, enabled } = useCourseIdWithGate();
  const areGradesFrozen = useAssignmentTypes(courseId, { enabled }).data?.areGradesFrozen;
  const canUserViewGradebook = useCanViewGradebook();
  const showBulkManagement = useShowBulkManagement();

  const handleToggleViewClick = () => setActiveView(
    activeView === views.grades
      ? views.bulkManagementHistory
      : views.grades,
  );

  const toggleViewMessage = activeView === views.grades
    ? messages.toActivityLog
    : messages.toGradesView;

  return {
    areGradesFrozen,
    canUserViewGradebook,
    courseId,
    showBulkManagement,

    handleToggleViewClick,
    toggleViewMessage,
  };
};

export default useGradebookHeaderData;
