import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';
import { GradeFormats } from '@src/data/constants/grades';

import { formatMessage } from 'testUtils';
import { actions, selectors } from '@src/data/redux/hooks';
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
      expect(el.snapshot).toMatchSnapshot();
    });
    test('label', () => {
      const label = el.instance.children[0];
      expect(label.children[0].el).toEqual(`${formatMessage(messages.scoreView)}`);
    });
    describe('form control', () => {
      let control;
      beforeEach(() => {
        control = el.instance.children;
      });
      test('value and onChange from redux hooks', () => {
        expect(control[1].props.value).toEqual(gradeFormat);
        expect(control[1].props.onChange).toEqual(toggleGradeFormat);
      });
      test('absolute and percent options', () => {
        const { children } = control[1];
        expect(children[0].props.value).toEqual(GradeFormats.percent);
        expect(children[0].children[0].el).toEqual(formatMessage(messages.percent));
        expect(children[1].props.value).toEqual(GradeFormats.absolute);
        expect(children[1].children[0].el).toEqual(formatMessage(messages.absolute));
      });
    });
  });
});
