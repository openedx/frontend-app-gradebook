import React from 'react';
import { shallow } from 'enzyme';

import { useIntl } from '@edx/frontend-platform/i18n';
import { GradeFormats } from 'data/constants/grades';

import { formatMessage } from 'testUtils';
import { actions, selectors } from 'data/redux/hooks';
import ScoreViewInput from '.';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: { useToggleGradeFormat: jest.fn() },
  },
  selectors: {
    grades: { useGradeData: jest.fn() },
  },
}));

const toggleGradeFormat = jest.fn().mockName('hooks.toggleGradeFormat');
actions.grades.useToggleGradeFormat.mockReturnValue(toggleGradeFormat);
const gradeFormat = 'test-grade-format';
selectors.grades.useGradeData.mockReturnValue({ gradeFormat });

let el;
describe('ScoreViewInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<ScoreViewInput />);
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(actions.grades.useToggleGradeFormat).toHaveBeenCalled();
      expect(selectors.grades.useGradeData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('label', () => {
      const label = el.children().at(0);
      expect(label.text()).toEqual(`${formatMessage(messages.scoreView)}:`);
    });
    describe('form control', () => {
      let control;
      beforeEach(() => {
        control = el.children().at(1);
      });
      test('value and onChange from redux hooks', () => {
        expect(control.props().value).toEqual(gradeFormat);
        expect(control.props().onChange).toEqual(toggleGradeFormat);
      });
      test('absolute and percent options', () => {
        const children = control.children();
        expect(children.at(0).props().value).toEqual(GradeFormats.percent);
        expect(children.at(0).text()).toEqual(formatMessage(messages.percent));
        expect(children.at(1).props().value).toEqual(GradeFormats.absolute);
        expect(children.at(1).text()).toEqual(formatMessage(messages.absolute));
      });
    });
  });
});
