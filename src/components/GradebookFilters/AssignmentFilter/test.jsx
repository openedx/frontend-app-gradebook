import React from 'react';
import { mount, shallow } from 'enzyme';

import selectors from 'data/selectors';
import actions from 'data/actions';
import { fetchGradesIfAssignmentGradeFiltersSet } from 'data/thunkActions/grades';
import {
  AssignmentFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/thunkActions/grades', () => ({
  updateGradesIfAssignmentGradeFiltersSet: jest.fn(),
}));

jest.mock('data/selectors', () => ({
  /** Mocking to use passed state for validation purposes */
  filters: {
    selectableAssignmentLabels: jest.fn(() => ([{
      label: 'assigNment',
      subsectionLabel: 'subsection',
      type: 'assignMentType',
      id: 'subsectionId',
    }])),
    selectedAssignmentLabel: jest.fn(() => 'assigNment'),
    assignmentType: jest.fn(() => 'assignMentType'),
    cohort: jest.fn(() => 'COhort'),
    track: jest.fn(() => 'traCK'),
  },
}));

describe('AssignmentFilter', () => {
  let props = {
    assignmentFilterOptions: [
      {
        label: 'assgN1',
        subsectionLabel: 'subLabel1',
        type: 'assgn_Type1',
        id: 'assgn_iD1',
      },
      {
        label: 'assgN2',
        subsectionLabel: 'subLabel2',
        type: 'assgn_Type2',
        id: 'assgn_iD2',
      },
    ],
    selectedAssignment: 'assgN1',
  };

  beforeEach(() => {
    props = {
      ...props,
      updateQueryParams: jest.fn(),
      fetchGradesIfAssignmentGradeFiltersSet: jest.fn(),
      updateAssignmentFilter: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      describe('handleChange', () => {
        let el;
        const newAssgn = 'assgN1';
        const event = { target: { value: newAssgn } };
        const selected = props.assignmentFilterOptions[0];
        beforeEach(() => {
          el = mount(<AssignmentFilter {...props} />);
          el.instance().handleChange(event);
        });
        it('calls props.updateAssignmentFilter with selection', () => {
          expect(props.updateAssignmentFilter).toHaveBeenCalledWith({
            label: newAssgn,
            type: selected.type,
            id: selected.id,
          });
        });
        it(
          'calls props.updateQueryParams with selected assignment id',
          () => {
            expect(props.updateQueryParams).toHaveBeenCalledWith({
              assignment: selected.id,
            });
          },
        );
        it('calls props.fetchGradesIfAssignmentGradeFiltersSet', () => {
          const method = props.fetchGradesIfAssignmentGradeFiltersSet;
          expect(method).toHaveBeenCalledWith();
        });
        describe('no selected option', () => {
          const value = 'fake';
          beforeEach(() => {
            el = mount(<AssignmentFilter {...props} />);
            el.instance().handleChange({ target: { value } });
          });
          it('calls props.updateAssignmentFilter with selection', () => {
            expect(props.updateAssignmentFilter).toHaveBeenCalledWith({
              label: value,
              type: undefined,
              id: undefined,
            });
          });
          it(
            'calls props.updateQueryParams with selected assignment id',
            () => {
              expect(props.updateQueryParams).toHaveBeenCalledWith({
                assignment: undefined,
              });
            },
          );
          it('calls props.fetchGradesIfAssignmentGradeFiltersSet', () => {
            const method = props.fetchGradesIfAssignmentGradeFiltersSet;
            expect(method).toHaveBeenCalledWith();
          });
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<AssignmentFilter {...props} />);
        el.instance().handleChange = jest.fn().mockName('handleChange');
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const state = {
      filters: {
        assignment: { label: 'assigNment' },
        assignmentType: 'assignMentType',
        cohort: 'COhort',
        track: 'traCK',
      },
    };
    describe('assignmentFilterOptions', () => {
      it('is selected from filters.selectableAssignmentLabels', () => {
        expect(
          mapStateToProps(state).assignmentFilterOptions,
        ).toEqual(
          selectors.filters.selectableAssignmentLabels(state),
        );
      });
    });
    describe('selectedAssignment', () => {
      it('is selected from filters.selectedAssignmentLabel', () => {
        expect(
          mapStateToProps(state).selectedAssignment,
        ).toEqual(
          selectors.filters.selectedAssignmentLabel(state),
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('updateAssignmentFilter', () => {
      expect(mapDispatchToProps.updateAssignmentFilter).toEqual(
        actions.filters.update.assignment,
      );
    });
    test('fetchGradesIfAsssignmentGradeFiltersSet', () => {
      const prop = mapDispatchToProps.fetchGradesIfAssignmentGradeFiltersSet;
      expect(prop).toEqual(fetchGradesIfAssignmentGradeFiltersSet);
    });
  });
});
