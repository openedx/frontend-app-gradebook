import { useFilters } from '@src/data/filtersContext';
import { useCourseId } from '@src/data/courseIdContext';
import { trackFilterApplied } from '@src/data/services/segment/events';
import { useRefetchGrades } from '@src/components/GradesView/data/hooks';

import { useAreCourseGradeFiltersValid } from '../data/hooks';

export const useCourseGradeFilterData = ({
  updateQueryParams,
}) => {
  const isDisabled = !useAreCourseGradeFiltersValid();
  const courseId = useCourseId();
  const {
    courseGradeMin,
    courseGradeMax,
    setCourseGradeMin,
    setCourseGradeMax,
    applyCourseGradeLimits,
  } = useFilters();
  const fetchGrades = useRefetchGrades();

  const handleApplyClick = () => {
    const localCourseLimits = { courseGradeMin, courseGradeMax };
    applyCourseGradeLimits(localCourseLimits);
    trackFilterApplied(courseId);
    fetchGrades();
    updateQueryParams(localCourseLimits);
  };

  return {
    max: {
      value: courseGradeMax,
      onChange: (e) => {
        setCourseGradeMax(e.target.value);
      },
    },
    min: {
      value: courseGradeMin,
      onChange: (e) => {
        setCourseGradeMin(e.target.value);
      },
    },
    handleApplyClick,
    isDisabled,
  };
};

export default useCourseGradeFilterData;
