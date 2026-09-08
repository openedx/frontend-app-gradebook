import { useGrades } from '@src/components/GradesView/data/apiHook';
import { useCourseIdWithGate } from '@src/data/apiHook';
import { useGradebookUi } from '@src/data/gradebookUiContext';

/**
 * <GradebookDataLoader />
 * Headless component that eagerly mounts the main grades query for the routed
 * GradebookPage subtree (where `courseId` is available via the router). Renders
 * nothing; it exists so the grades fetch runs on page load regardless of which
 * view is active. Wires the roles gate + current pagination cursor into the
 * pure `useGrades` query.
 */
const GradebookDataLoader = () => {
  const { courseId, enabled } = useCourseIdWithGate();
  const { gradesPageEndpoint } = useGradebookUi();
  useGrades(courseId, gradesPageEndpoint, { enabled });
  return null;
};

export default GradebookDataLoader;
