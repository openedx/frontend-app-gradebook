import { useFilters } from 'data/filtersContext';
import { useRefetchGrades } from 'components/GradesView/data/hooks';

import { useCohorts, useTracks } from '../data/apiHook';
import { useSelectedCohortEntry, useSelectedTrackEntry } from '../data/hooks';

const EMPTY_ARRAY = [];

export const useStudentGroupsFilterData = ({ updateQueryParams }) => {
  const selectedCohortEntry = useSelectedCohortEntry();
  const selectedTrackEntry = useSelectedTrackEntry();

  const cohorts = useCohorts().data ?? EMPTY_ARRAY;
  const tracks = useTracks().data ?? EMPTY_ARRAY;

  const { setCohort, setTrack } = useFilters();
  const fetchGrades = useRefetchGrades();

  const handleUpdateTrack = (event) => {
    const selectedTrackItem = tracks.find(track => track.slug === event.target.value);
    const track = selectedTrackItem ? selectedTrackItem.slug.toString() : null;
    updateQueryParams({ track });
    setTrack(track ?? '');
    fetchGrades();
  };

  const handleUpdateCohort = (event) => {
    const selectedCohortItem = cohorts.find(cohort => cohort.id === parseInt(event.target.value, 10));
    const cohort = selectedCohortItem ? selectedCohortItem.id.toString() : null;
    // the param expected to be cohort_id
    updateQueryParams({ cohort });
    setCohort(cohort ?? '');
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
