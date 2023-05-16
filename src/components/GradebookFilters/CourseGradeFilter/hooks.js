import { actions, selectors, thunkActions } from 'data/redux/hooks';

export const useCourseGradeFilterData = ({
  updateQueryParams,
}) => {
  const isDisabled = !selectors.app.useAreCourseGradeFiltersValid();
  const localCourseLimits = selectors.app.useCourseGradeLimits();
  const fetchGrades = thunkActions.grades.useFetchGrades();
  const setLocalFilter = actions.app.useSetLocalFilter();
  const updateFilter = actions.filters.useUpdateCourseGradeLimits();

  const handleApplyClick = () => {
    updateFilter(localCourseLimits);
    fetchGrades();
    updateQueryParams(localCourseLimits);
  };

  const { courseGradeMin, courseGradeMax } = localCourseLimits;
  return {
    max: {
      value: courseGradeMax,
      onChange: (e) => setLocalFilter({ courseGradeMax: e.target.value }),
    },
    min: {
      value: courseGradeMin,
      onChange: (e) => setLocalFilter({ courseGradeMin: e.target.value }),
    },
    handleApplyClick,
    isDisabled,
  };
};

export default useCourseGradeFilterData;
