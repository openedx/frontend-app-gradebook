import { renderHook, act } from '@testing-library/react';

import { useCourseIdWithGate } from '@src/data/apiHook';
import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades } from '@src/components/GradesView/data/hooks';
import { useCohorts, useTracks } from '../data/apiHook';
import { useSelectedCohortEntry, useSelectedTrackEntry } from '../data/hooks';
import useStudentGroupsFilterData from './hooks';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCourseIdWithGate: jest.fn(),
}));
jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useRefetchGrades: jest.fn(),
}));
jest.mock('../data/apiHook', () => ({
  ...jest.requireActual('../data/apiHook'),
  useCohorts: jest.fn(),
  useTracks: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useSelectedCohortEntry: jest.fn(),
  useSelectedTrackEntry: jest.fn(),
}));

const cohortA = { id: 11, name: 'cohort A' };
const cohortB = { id: 22, name: 'cohort B' };
const trackA = { slug: 'aud', name: 'Audit' };
const trackB = { slug: 'ver', name: 'Verified' };

const primeMocks = ({
  cohorts = [cohortA, cohortB],
  tracks = [trackA, trackB],
  selectedCohort = cohortA,
  selectedTrack = trackA,
} = {}) => {
  const setCohort = jest.fn();
  const setTrack = jest.fn();
  const fetchGrades = jest.fn();
  useCourseIdWithGate.mockReturnValue({ courseId: 'test-course', enabled: true });
  useCohorts.mockReturnValue({ data: cohorts });
  useTracks.mockReturnValue({ data: tracks });
  useSelectedCohortEntry.mockReturnValue(selectedCohort);
  useSelectedTrackEntry.mockReturnValue(selectedTrack);
  useFilters.mockReturnValue({ setCohort, setTrack });
  useRefetchGrades.mockReturnValue(fetchGrades);
  return { setCohort, setTrack, fetchGrades };
};

const updateQueryParams = jest.fn();

describe('useStudentGroupsFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cohorts', () => {
    it('exposes the selected cohort id and disables when there are no cohorts', () => {
      primeMocks({ cohorts: [] });
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      expect(result.current.cohorts.value).toBe(cohortA.id);
      expect(result.current.cohorts.isDisabled).toBe(true);
    });

    it('maps cohort entries to { value, name }', () => {
      primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      expect(result.current.cohorts.entries).toEqual([
        { value: cohortA.id, name: cohortA.name },
        { value: cohortB.id, name: cohortB.name },
      ]);
    });

    it('defaults the selected value to empty when no cohort is picked', () => {
      primeMocks({ selectedCohort: null });
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      expect(result.current.cohorts.value).toBe('');
    });

    it('updates cohort, query params, and fetches on change', () => {
      const { setCohort, fetchGrades } = primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      act(() => {
        result.current.cohorts.handleChange({ target: { value: String(cohortB.id) } });
      });
      expect(setCohort).toHaveBeenCalledWith(String(cohortB.id));
      expect(updateQueryParams).toHaveBeenCalledWith({ cohort: String(cohortB.id) });
      expect(fetchGrades).toHaveBeenCalled();
    });

    it('passes null when the selected cohort does not match any known cohort', () => {
      const { setCohort } = primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      act(() => {
        result.current.cohorts.handleChange({ target: { value: '9999' } });
      });
      expect(setCohort).toHaveBeenCalledWith('');
      expect(updateQueryParams).toHaveBeenCalledWith({ cohort: null });
    });
  });

  describe('tracks', () => {
    it('exposes the selected track slug and maps entries', () => {
      primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      expect(result.current.tracks.value).toBe(trackA.slug);
      expect(result.current.tracks.entries).toEqual([
        { value: trackA.slug, name: trackA.name },
        { value: trackB.slug, name: trackB.name },
      ]);
    });

    it('defaults the selected value to empty when no track is picked', () => {
      primeMocks({ selectedTrack: null });
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      expect(result.current.tracks.value).toBe('');
    });

    it('updates track, query params, and fetches on change', () => {
      const { setTrack, fetchGrades } = primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      act(() => {
        result.current.tracks.handleChange({ target: { value: trackB.slug } });
      });
      expect(setTrack).toHaveBeenCalledWith(trackB.slug);
      expect(updateQueryParams).toHaveBeenCalledWith({ track: trackB.slug });
      expect(fetchGrades).toHaveBeenCalled();
    });

    it('passes null when the selected track slug does not match', () => {
      const { setTrack } = primeMocks();
      const { result } = renderHook(() => useStudentGroupsFilterData({ updateQueryParams }));
      act(() => {
        result.current.tracks.handleChange({ target: { value: 'other' } });
      });
      expect(setTrack).toHaveBeenCalledWith('');
      expect(updateQueryParams).toHaveBeenCalledWith({ track: null });
    });
  });
});
