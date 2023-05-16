import { actions, selectors, thunkActions } from 'data/redux/hooks';

export const useStudentGroupsFilterData = ({ updateQueryParams }) => {
  const selectedCohortEntry = selectors.root.useSelectedCohortEntry();
  const selectedTrackEntry = selectors.root.useSelectedTrackEntry();

  const cohorts = selectors.cohorts.useAllCohorts();
  const tracks = selectors.tracks.useAllTracks();

  const updateCohort = actions.filters.useUpdateCohort();
  const updateTrack = actions.filters.useUpdateTrack();

  const fetchGrades = thunkActions.grades.useFetchGrades();

  const handleUpdateTrack = (event) => {
    const selectedTrackItem = tracks.find(track => track.slug === event.target.value);
    const track = selectedTrackItem ? selectedTrackItem.slug.toString() : null;
    updateQueryParams({ track });
    updateTrack(track);
    fetchGrades();
  };

  const handleUpdateCohort = (event) => {
    const selectedCohortItem = cohorts.find(cohort => cohort.id === parseInt(event.target.value, 10));
    const cohort = selectedCohortItem ? selectedCohortItem.id.toString() : null;
    // the param expected to be cohort_id
    updateQueryParams({ cohort });
    updateCohort(cohort);
    fetchGrades();
  };
  return {
    cohorts: {
      value: selectedCohortEntry?.id || '',
      isDisabled: cohorts.length === 0,
      handleChange: handleUpdateCohort,
      entries: cohorts.map(({ id: value, name }) => ({ value, name })),
    },
    tracks: {
      value: selectedTrackEntry?.slug || '',
      handleChange: handleUpdateTrack,
      entries: tracks.map(({ slug: value, name }) => ({ value, name })),
    },
  };
};

export default useStudentGroupsFilterData;
