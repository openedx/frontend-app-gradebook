import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '@edx/paragon';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import {
  GradeButton,
  mapStateToProps,
  mapDispatchToProps,
} from './GradeButton';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    assignmentTypes: {
      areGradesFrozen: jest.fn(state => ({ areGradesFrozen: state })),
    },
    grades: {
      subsectionGrade: {
        percent: jest.fn(subsection => ({ percent: subsection })),
      },
      gradeFormat: jest.fn(state => ({ gradeFormat: state })),
    },
  },
}));

jest.mock('data/thunkActions', () => ({
  app: {
    setModalStateFromTable: jest.fn(),
  },
}));

describe('GradeButton', () => {
  let el;
  let props = {
    subsection: {
      attempted: false,
      percent: 23,
      score_possible: 32,
      subsection_name: 'the things we do',
      module_id: 'in potions',
    },
    entry: {
      user_id: 2,
      username: 'Jessie',
    },
    areGradesFrozen: false,
    format: 'percent',
  };
  beforeEach(() => {
    props = { ...props, setModalState: jest.fn() };
  });
  describe('component', () => {
    describe('snapshots', () => {
      test('grades are frozen', () => {
        el = shallow(<GradeButton {...{ ...props, areGradesFrozen: true }} />);
        const label = 'why you gotta label people?';
        jest.spyOn(el.instance(), 'label', 'get').mockReturnValue(label);
        el.instance().onClick = jest.fn().mockName('this.onClick');
        expect(el.instance().render()).toMatchSnapshot();
        expect(el.instance().render()).toEqual(label);
      });
      test('grades are not frozen', () => {
        el = shallow(<GradeButton {...props} />);
        const label = 'why you gotta label people?';
        jest.spyOn(el.instance(), 'label', 'get').mockReturnValue(label);
        el.instance().onClick = jest.fn().mockName('this.onClick');
        expect(el.instance().render()).toMatchSnapshot();
        expect(el.instance().render().props.children).toEqual(label);
        expect(el.render().is(Button)).toEqual(true);
      });
    });
    describe('label', () => {
      it('calls the appropriate formatter with the subsection prop', () => {
        el = shallow(<GradeButton {...props} />);
        expect(
          el.instance().label,
        ).toEqual(selectors.grades.subsectionGrade[props.format](props.subsection));
      });
    });
    describe('onClick', () => {
      it('calls props.setModalState with userEntry and subsection', () => {
        el = shallow(<GradeButton {...props} />);
        el.instance().onClick();
        expect(props.setModalState).toHaveBeenCalledWith({
          userEntry: props.entry,
          subsection: props.subsection,
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { teams: { rocket: ['jesse', 'james'] } };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('areGradesFrozen form assignmentTypes.areGradesFrozen', () => {
      expect(
        mapped.areGradesFrozen,
      ).toEqual(selectors.assignmentTypes.areGradesFrozen(testState));
    });
    test('format form grades.format', () => {
      expect(mapped.format).toEqual(selectors.grades.gradeFormat(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('setModalState from thunkActions.app.setModalStateFromTable', () => {
      expect(mapDispatchToProps.setModalState).toEqual(thunkActions.app.setModalStateFromTable);
    });
  });
});
