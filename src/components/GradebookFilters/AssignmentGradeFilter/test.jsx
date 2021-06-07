import React from 'react';
import { mount, shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { fetchGrades } from 'data/thunkActions/grades';

import {
  AssignmentGradeFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {},
    filters: {},
    grades: {},
  },
}));

jest.mock('data/thunkActions/grades', () => ({
  fetchGrades: jest.fn(),
}));

describe('AssignmentGradeFilter', () => {
  let props = {};
  beforeEach(() => {
    props = {
      ...props,
      updateQueryParams: jest.fn(),
      fetchGrades: jest.fn(),
      localAssignmentLimits: {
        assignmentGradeMax: '98',
        assignmentGradeMin: '2',
      },
      selectedAssignment: 'Potions 101.5',
      setFilter: jest.fn(),
      updateAssignmentLimits: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      let el;
      beforeEach(() => {
        el = mount(<AssignmentGradeFilter {...props} />);
      });
      describe('handleSubmit', () => {
        beforeEach(() => {
          el.instance().handleSubmit();
        });
        it('calls props.updateAssignmentLimits with local assignment limits', () => {
          expect(props.updateAssignmentLimits).toHaveBeenCalledWith(props.localAssignmentLimits);
        });
        it('calls fetchUserGrades', () => {
          expect(props.fetchGrades).toHaveBeenCalledWith();
        });
        it('updates queryParams with assignment grade min and max', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith(props.localAssignmentLimits);
        });
      });
      describe('handleSetMin', () => {
        it('calls setFilters for assignmentGradeMin', () => {
          const testVal = 23;
          el.instance().handleSetMin({ target: { value: testVal } });
          expect(props.setFilter).toHaveBeenCalledWith({
            assignmentGradeMin: testVal,
          });
        });
      });
      describe('handleSetMax', () => {
        it('calls setFilters for assignmentGradeMax', () => {
          const testVal = 92;
          el.instance().handleSetMax({ target: { value: testVal } });
          expect(props.setFilter).toHaveBeenCalledWith({
            assignmentGradeMax: testVal,
          });
        });
      });
    });
    describe('snapshots', () => {
      let el;
      const mockMethods = () => {
        el.instance().handleSubmit = jest.fn().mockName('handleSubmit');
        el.instance().handleSetMax = jest.fn().mockName('handleSetMax');
        el.instance().handleSetMin = jest.fn().mockName('handleSetMin');
      };
      test('smoke test', () => {
        el = shallow(<AssignmentGradeFilter {...props} />);
        mockMethods(el);
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('buttons and groups disabled if no selected assignment', () => {
        el = shallow(<AssignmentGradeFilter
          {...props}
          selectedAssignment={undefined}
        />);
        mockMethods(el);
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { belle: 'in', the: 'castle' };
    let mappedProps;
    beforeEach(() => {
      selectors.app.assignmentGradeLimits = jest.fn((state) => ({ gradeLimits: state }));
      selectors.filters.selectedAssignmentLabel = jest.fn((state) => ({ assignmentLabel: state }));
      mappedProps = mapStateToProps(testState);
    });
    describe('localAssignmentLimits', () => {
      it('returns selectors.app.assignmentGradeLimits', () => {
        expect(
          mappedProps.localAssignmentLimits,
        ).toEqual(selectors.app.assignmentGradeLimits(testState));
      });
    });
    describe('selectedAsssignment', () => {
      it('returns selectors.filters.selectedAssignmentLabel', () => {
        expect(
          mappedProps.selectedAssignment,
        ).toEqual(selectors.filters.selectedAssignmentLabel(testState));
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('fetchGrades', () => {
      expect(mapDispatchToProps.fetchGrades).toEqual(fetchGrades);
    });
    test('setFilters', () => {
      expect(mapDispatchToProps.setFilter).toEqual(actions.app.setLocalFilter);
    });
    test('updateAssignmentLimits', () => {
      expect(
        mapDispatchToProps.updateAssignmentLimits,
      ).toEqual(
        actions.filters.update.assignmentLimits,
      );
    });
  });
});
