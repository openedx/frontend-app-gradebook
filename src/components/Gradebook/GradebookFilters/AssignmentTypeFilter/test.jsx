import React from 'react';
import { shallow } from 'enzyme';

import { filterAssignmentType } from 'data/actions/grades';

import {
  AssignmentTypeFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/selectors/filters', () => ({
  /** Mocking to use passed state for validation purposes */
  selectableAssignmentLabels: jest.fn().mockImplementation((state) => ({
    state,
    selectableLabels: 'selectableLabels',
  })),
}));

describe('AssignmentTypeFilter', () => {
  let props = {
    assignmentTypes: ['assignMentType1', 'AssigNmentType2'],
    assignmentFilterOptions: [
      { label: 'filterLabel1', subsectionLabel: 'filterSubLabel2' },
      { label: 'filterLabel2', subsectionLabel: 'filterSubLabel1' },
    ],
    selectedAssignmentType: 'assigNmentType2',
  };

  beforeEach(() => {
    props = {
      ...props,
      filterAssignmentType: jest.fn(),
      updateQueryParams: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      describe('handleChange', () => {
        let el;
        const newType = 'new Type';
        const event = { target: { value: newType } };
        beforeEach(() => {
          el = shallow(<AssignmentTypeFilter {...props} />);
          el.instance().handleChange(event);
        });
        it('calls props.filterAssignmentType with new type', () => {
          expect(props.filterAssignmentType).toHaveBeenCalledWith(
            newType,
          );
        });
        it('updates queryParams with assignmentType', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            assignmentType: newType,
          });
        });
      });
    });
    describe('snapshots', () => {
      let el;
      const mockMethods = () => {
        el.instance().handleChange = jest.fn().mockName('handleChange');
      };
      test('smoke test', () => {
        el = shallow(<AssignmentTypeFilter {...props} />);
        mockMethods(el);
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('SelectGroup disabled if no assignmentFilterOptions', () => {
        el = shallow(<AssignmentTypeFilter
          {...props}
          assignmentFilterOptions={[]}
        />);
        mockMethods(el);
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const state = {
      assignmentTypes: {
        results: ['assignMentType1', 'assignMentType2'],
      },
      filters: {
        assignmentType: 'selectedAssignMent',
        cohort: 'selectedCOHOrt',
        track: 'SELectedTrack',
      },
    };
    describe('assignmentTypes', () => {
      it('is drawn from assignmentTypes.results', () => {
        expect(mapStateToProps(state).assignmentTypes).toEqual(
          state.assignmentTypes.results,
        );
      });
    });
    describe('assignmentFilterOptions', () => {
      it('is drawn from selectableAssignmentLabels', () => {
        expect(mapStateToProps(state).assignmentFilterOptions).toEqual({
          state,
          selectableLabels: 'selectableLabels',
        });
      });
    });
    describe('selectedAssignmentType', () => {
      it('is drawn from state.filters.assignmentType', () => {
        expect(
          mapStateToProps(state).selectedAssignmentType,
        ).toEqual(
          state.filters.assignmentType,
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('filterAssignmentType', () => {
      expect(mapDispatchToProps.filterAssignmentType).toEqual(
        filterAssignmentType,
      );
    });
  });
});
