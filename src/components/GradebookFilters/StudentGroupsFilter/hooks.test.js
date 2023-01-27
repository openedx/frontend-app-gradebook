import { selectors, actions, thunkActions } from 'data/redux/hooks';

import useAssignmentFilterData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useSelectedCohortEntry: jest.fn(),
      useSelectedTrackEntry: jest.fn(),
    },
    cohorts: { useAllCohorts: jest.fn() },
    tracks: { useAllTracks: jest.fn() },
  },
  actions: {
    filters: {
      useUpdateCohort: jest.fn(),
      useUpdateTrack: jest.fn(),
    },
  },
  thunkActions: {
    grades: { useFetchGrades: jest.fn() },
  },
}));

let out;

const testCohort = { name: 'cohort-name', id: 999 };
selectors.root.useSelectedCohortEntry.mockReturnValue(testCohort);
const testTrack = { name: 'track-name', slug: 8080 };
selectors.root.useSelectedTrackEntry.mockReturnValue(testTrack);
const allCohorts = [
  testCohort,
  { name: 'cohort1', id: 11 },
  { name: 'cohort2', id: 22 },
  { name: 'cohort3', id: 33 },
];
selectors.cohorts.useAllCohorts.mockReturnValue(allCohorts);
const allTracks = [
  testTrack,
  { name: 'track1', slug: 111 },
  { name: 'track2', slug: 222 },
  { name: 'track3', slug: 333 },
];
selectors.tracks.useAllTracks.mockReturnValue(allTracks);

const updateCohort = jest.fn();
actions.filters.useUpdateCohort.mockReturnValue(updateCohort);
const updateTrack = jest.fn();
actions.filters.useUpdateTrack.mockReturnValue(updateTrack);
const fetch = jest.fn();
thunkActions.grades.useFetchGrades.mockReturnValue(fetch);

const updateQueryParams = jest.fn();

describe('useAssignmentFilterData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useAssignmentFilterData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.root.useSelectedCohortEntry).toHaveBeenCalledWith();
      expect(selectors.root.useSelectedTrackEntry).toHaveBeenCalledWith();
      expect(selectors.cohorts.useAllCohorts).toHaveBeenCalledWith();
      expect(selectors.tracks.useAllTracks).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateCohort).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateTrack).toHaveBeenCalledWith();
      expect(thunkActions.grades.useFetchGrades).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    describe('cohorts', () => {
      test('value from hook', () => {
        expect(out.cohorts.value).toEqual(testCohort.name);
      });
      test('disabled iff no cohorts found', () => {
        expect(out.cohorts.isDisabled).toEqual(false);
        selectors.cohorts.useAllCohorts.mockReturnValueOnce([]);
        out = useAssignmentFilterData({ updateQueryParams });
        expect(out.cohorts.isDisabled).toEqual(true);
      });
      test('entries map id to value', () => {
        const { entries } = out.cohorts;
        expect(entries[0]).toEqual({ value: testCohort.id, name: testCohort.name });
        expect(entries[1]).toEqual({ value: allCohorts[1].id, name: allCohorts[1].name });
        expect(entries[2]).toEqual({ value: allCohorts[2].id, name: allCohorts[2].name });
        expect(entries[3]).toEqual({ value: allCohorts[3].id, name: allCohorts[3].name });
      });
      describe('handleEvent', () => {
        it('updates filter and query params and fetches grades', () => {
          out.cohorts.handleChange({ target: { value: testCohort.name } });
          expect(updateCohort).toHaveBeenCalledWith(testCohort.id.toString());
          expect(updateQueryParams).toHaveBeenCalledWith({ cohort: testCohort.id.toString() });
          expect(fetch).toHaveBeenCalled();
        });
        it('passes null if no matching track is found', () => {
          out.cohorts.handleChange({ target: { value: 'fake-name' } });
          expect(updateCohort).toHaveBeenCalledWith(null);
          expect(updateQueryParams).toHaveBeenCalledWith({ cohort: null });
          expect(fetch).toHaveBeenCalled();
        });
      });
    });
    describe('tracks', () => {
      test('value from hook', () => {
        expect(out.tracks.value).toEqual(testTrack.name);
      });
      test('entries map slug to value', () => {
        const { entries } = out.tracks;
        expect(entries[0]).toEqual({ value: testTrack.slug, name: testTrack.name });
        expect(entries[1]).toEqual({ value: allTracks[1].slug, name: allTracks[1].name });
        expect(entries[2]).toEqual({ value: allTracks[2].slug, name: allTracks[2].name });
        expect(entries[3]).toEqual({ value: allTracks[3].slug, name: allTracks[3].name });
      });
      describe('handleEvent', () => {
        it('updates filter and query params and fetches grades', () => {
          out.tracks.handleChange({ target: { value: testTrack.name } });
          expect(updateTrack).toHaveBeenCalledWith(testTrack.slug.toString());
          expect(updateQueryParams).toHaveBeenCalledWith({ track: testTrack.slug.toString() });
          expect(fetch).toHaveBeenCalled();
        });
        it('passes null if no matching track is found', () => {
          out.tracks.handleChange({ target: { value: 'fake-name' } });
          expect(updateTrack).toHaveBeenCalledWith(null);
          expect(updateQueryParams).toHaveBeenCalledWith({ track: null });
          expect(fetch).toHaveBeenCalled();
        });
      });
    });
  });
});
