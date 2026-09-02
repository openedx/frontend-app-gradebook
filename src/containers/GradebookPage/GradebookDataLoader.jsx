import { useGrades } from 'components/GradesView/data/apiHook';

/**
 * <GradebookDataLoader />
 * Headless component that eagerly mounts the main grades query for the routed
 * GradebookPage subtree (where `courseId` is available via the router). Renders
 * nothing; it exists so the grades fetch runs on page load regardless of which
 * view is active. The query is gated internally on the roles permission query.
 */
const GradebookDataLoader = () => {
  useGrades();
  return null;
};

export default GradebookDataLoader;
