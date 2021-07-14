/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import { fetchGrades } from 'data/thunkActions/grades';
import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  optionFactory,
  StudentGroupsFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      selectedCohortEntry: jest.fn(state => ({ selectedCohortEntry: state })),
      selectedTrackEntry: jest.fn(state => ({ selectedTrackEntry: state })),
    },
    cohorts: {
      allCohorts: jest.fn(state => ({ allCohorts: state })),
      cohortsByName: jest.fn(state => ({ cohortsByName: state })),
    },
    tracks: {
      allTracks: jest.fn(state => ({ allTracks: state })),
      tracksByName: jest.fn(state => ({ tracksByName: state })),
    },
  },
}));

jest.mock('data/thunkActions/grades', () => ({
  fetchGrades: jest.fn(),
}));

describe('StudentGroupsFilter', () => {
  let props = {
    cohorts: [
      { name: 'cohorT1', id: 8001 },
      { name: 'cohorT2', id: 8002 },
      { name: 'cohorT3', id: 8003 },
    ],
    tracks: [
      { name: 'TracK1', slug: 'TracK1_slug' },
      { name: 'TracK2', slug: 'TracK2_slug' },
      { name: 'TRACK3', slug: 'TRACK3_slug' },
    ],
  };

  describe('optionFactory', () => {
    it('returns a list of options with a default first entry', () => {
      const data = [{ cMark: 'rainbow', name: 'RDash' }, { cMark: 'balloons', name: 'PPie' }];
      const defaultOption = 'All-Ponies';
      const key = 'cMark';
      const options = optionFactory({ data, defaultOption, key });
      expect(options).toMatchSnapshot();
    });
  });

  describe('Component', () => {
    beforeEach(() => {
      props = {
        ...props,
        intl: { formatMessage: (msg) => msg.defaultMessage },
        cohortsByName: {
          [props.cohorts[0].name]: props.cohorts[0],
          [props.cohorts[1].name]: props.cohorts[1],
          [props.cohorts[2].name]: props.cohorts[2],
        },
        tracksByName: {
          [props.tracks[0].name]: props.tracks[0],
          [props.tracks[1].name]: props.tracks[1],
          [props.tracks[2].name]: props.tracks[2],
        },
        fetchGrades: jest.fn(),
        selectedCohortEntry: props.cohorts[2],
        selectedTrackEntry: props.tracks[1],
        updateQueryParams: jest.fn(),
        updateCohort: jest.fn().mockName('updateCohort'),
        updateTrack: jest.fn().mockName('updateTrack'),
      };
    });

    describe('snapshots', () => {
      let el;
      beforeEach(() => {
        el = shallow(<StudentGroupsFilter {...props} />);
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
      test('Cohorts group disabled if no cohorts', () => {
        el.setProps({ cohorts: [] });
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
        el = shallow(<StudentGroupsFilter {...props} />);
      });
      describe('selectedCohortIdFromEvent', () => {
        it('returns the id of the cohort with the name matching the event', () => {
          expect(
            el.instance().selectedCohortIdFromEvent(
              { target: { value: props.cohorts[1].name } },
            ),
          ).toEqual(props.cohorts[1].id.toString());
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
          el = shallow(<StudentGroupsFilter {...props} />);
          jest.spyOn(
            el.instance(),
            'selectedTrackSlugFromEvent',
          ).mockReturnValue(selectedSlug);
          el.instance().updateTracks({ target: {} });
        });
        it('calls updateTrack with new value', () => {
          expect(props.updateTrack).toHaveBeenCalledWith(selectedSlug);
        });
        it('calls fetchGrades', () => {
          expect(props.fetchGrades).toHaveBeenCalledWith();
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
          el = shallow(<StudentGroupsFilter {...props} />);
          jest.spyOn(
            el.instance(),
            'selectedCohortIdFromEvent',
          ).mockReturnValue(selectedId);
          el.instance().updateCohorts({ target: {} });
        });
        it('calls updateCohort with new value', () => {
          expect(props.updateCohort).toHaveBeenCalledWith(selectedId);
        });
        it('calls fetchGrades', () => {
          expect(props.fetchGrades).toHaveBeenCalledWith();
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
    const testState = { h: 'e', l: 'l', o: 'oooooooooo' };
    let mappedProps;
    beforeAll(() => {
      mappedProps = mapStateToProps(testState);
    });
    test('cohorts from selectors.cohorts.allCohorts', () => {
      expect(mappedProps.cohorts).toEqual(selectors.cohorts.allCohorts(testState));
    });
    test('cohortsByName from selectors.cohorts.cohortsByName', () => {
      expect(mappedProps.cohortsByName).toEqual(selectors.cohorts.cohortsByName(testState));
    });
    test('selectedCohortEntry from selectors.root.selectedCohortEntry', () => {
      expect(
        mappedProps.selectedCohortEntry,
      ).toEqual(selectors.root.selectedCohortEntry(testState));
    });
    test('selectedTrackEntry from selectors.root.selectedTrackEntry', () => {
      expect(
        mappedProps.selectedTrackEntry,
      ).toEqual(selectors.root.selectedTrackEntry(testState));
    });
    test('tracks from selectors.tracks.allTracks', () => {
      expect(mappedProps.tracks).toEqual(selectors.tracks.allTracks(testState));
    });
    test('tracksByName from selectors.tracks.tracksByName', () => {
      expect(mappedProps.tracksByName).toEqual(selectors.tracks.tracksByName(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('fetchGrades from thunkActions.grades.fetchGrades', () => {
      expect(mapDispatchToProps.fetchGrades).toEqual(fetchGrades);
    });
    test('updateCohort from actions.filters.update.cohort', () => {
      expect(mapDispatchToProps.updateCohort).toEqual(actions.filters.update.cohort);
    });
    test('updateTrack from actions.filters.update.track', () => {
      expect(mapDispatchToProps.updateTrack).toEqual(actions.filters.update.track);
    });
  });
});
