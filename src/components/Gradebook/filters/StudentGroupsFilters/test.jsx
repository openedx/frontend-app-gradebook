/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import { fetchGrades } from 'data/actions/grades';
import {
  StudentGroupsFilters,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('@edx/paragon', () => ({
  Collapsible: 'Collapsible',
}));

describe('StudentGroupsFilters', () => {
  let props = {
    courseId: '12345',
    cohorts: [
      { name: 'cohorT1', id: 1 },
      { name: 'cohorT2', id: 2 },
      { name: 'cohorT3', id: 3 },
    ],
    selectedAssignmentType: 'assignMent type 1',
    selectedCohort: '3',
    selectedTrack: 'TracK2_slug',
    tracks: [
      { name: 'TracK1', slug: 'TracK1_slug' },
      { name: 'TracK2', slug: 'TracK2_slug' },
      { name: 'TRACK3', slug: 'TRACK3_slug' },
    ],
  };

  beforeEach(() => {
    props = {
      ...props,
      getUserGrades: jest.fn(),
      updateQueryParams: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('snapshots', () => {
      let el;
      beforeEach(() => {
        el = shallow(<StudentGroupsFilters {...props} />);
      });
      test('basic snapshot', () => {
        el.instance().updateTracks = jest.fn().mockName(
          'updateTracks',
        );
        el.instance().updateCohorts = jest.fn().mockName(
          'updateCohorts',
        );
        expect(el.instance().render()).toMatchSnapshot();
      });
      describe('mapCohortsEntries', () => {
        test('cohort options: [Cohort-All, <{slug, name}...>]', () => {
          expect(el.instance().mapCohortsEntries()).toMatchSnapshot();
        });
      });
      describe('mapTracksEntries', () => {
        test('cohort options: [Track-All, <{id, name}...>]', () => {
          expect(el.instance().mapTracksEntries()).toMatchSnapshot();
        });
      });
    });

    describe('behavior', () => {
      let el;
      beforeEach(() => {
        el = shallow(<StudentGroupsFilters {...props} />);
      });
      describe('mapSelectedCohortEntry', () => {
        it('returns the name of the cohort with the same numerical id', () => {
          // Because selectedCohort is the id of cohorts[2]
          expect(el.instance().mapSelectedCohortEntry()).toEqual(
            props.cohorts[2].name,
          );
        });
        it('returns "Cohorts" if no track is found', () => {
          el.setProps({ selectedCohort: '999' });
          expect(el.instance().mapSelectedCohortEntry()).toEqual(
            'Cohorts',
          );
        });
      });
      describe('mapSelectedTrackEntry', () => {
        it('returns the name of the track with the selected slug', () => {
          // Because selectedTrack is the slug of tracks[1]
          expect(el.instance().mapSelectedTrackEntry()).toEqual(
            props.tracks[1].name,
          );
        });
        it('returns "Tracks" if no track is found', () => {
          el.setProps({ selectedTrack: 'FAKE' });
          expect(el.instance().mapSelectedTrackEntry()).toEqual(
            'Tracks',
          );
        });
      });
      describe('selectedCohortIdFromEvent', () => {
        it('returns the id of the cohort with the name matching the event', () => {
          expect(
            el.instance().selectedCohortIdFromEvent(
              { target: { value: props.cohorts[1].name } },
            ),
          ).toEqual(props.cohorts[1].id);
        });
        it('returns null if no matching cohort is found', () => {
          expect(
            el.instance().selectedCohortIdFromEvent(
              { target: { value: 'FAKE' } },
            ),
          ).toEqual(null);
        });
      });
      describe('selectedTrackSlugFromEvent', () => {
        it('returns the slug of the track with the name matching the event', () => {
          expect(
            el.instance().selectedTrackSlugFromEvent(
              { target: { value: props.tracks[1].name } },
            ),
          ).toEqual(props.tracks[1].slug);
        });
        it('returns null if no matching track is found', () => {
          expect(
            el.instance().selectedTrackSlugFromEvent(
              { target: { value: 'FAKE' } },
            ),
          ).toEqual(null);
        });
      });
      describe('updateTracks', () => {
        const selectedSlug = 'SLUG';
        beforeEach(() => {
          el = shallow(<StudentGroupsFilters {...props} />);
          jest.spyOn(
            el.instance(),
            'selectedTrackSlugFromEvent',
          ).mockReturnValue(selectedSlug);
          el.instance().updateTracks({ target: {} });
        });
        it('calls getUserGrades with selection', () => {
          expect(props.getUserGrades).toHaveBeenCalledWith(
            props.courseId,
            props.selectedCohort,
            selectedSlug,
            props.selectedAssignmentType,
          );
        });
        it('updates queryParams with track value', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            track: selectedSlug,
          });
        });
      });
      describe('updateCohorts', () => {
        const selectedId = 23;
        beforeEach(() => {
          el = shallow(<StudentGroupsFilters {...props} />);
          jest.spyOn(
            el.instance(),
            'selectedCohortIdFromEvent',
          ).mockReturnValue(selectedId);
          el.instance().updateCohorts({ target: {} });
        });
        it('calls getUserGrades with selection', () => {
          expect(props.getUserGrades).toHaveBeenCalledWith(
            props.courseId,
            selectedId,
            props.selectedTrack,
            props.selectedAssignmentType,
          );
        });
        it('updates queryParams with cohort value', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            cohort: selectedId,
          });
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    const state = {
      cohorts: { results: ['cohorts'] },
      filters: {
        cohort: 'COHort',
        track: 'TRacK',
        assignmentType: 'TYPe',
      },
    };
    describe('selectedAssignmentType', () => {
      test('drawn from filters.assignmentType', () => {
        expect(mapStateToProps(state).selectedAssignmentType).toEqual(
          state.filters.assignmentType,
        );
      });
    });
    describe('selectedCohort', () => {
      test('drawn from filters.cohort', () => {
        expect(mapStateToProps(state).selectedCohort).toEqual(
          state.filters.cohort,
        );
      });
    });
    describe('selectedTrack', () => {
      test('drawn from filters.track', () => {
        expect(mapStateToProps(state).selectedTrack).toEqual(
          state.filters.track,
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    describe('getUserGrades', () => {
      test('from fetchGrades', () => {
        expect(mapDispatchToProps.getUserGrades).toEqual(fetchGrades);
      });
    });
  });
});
