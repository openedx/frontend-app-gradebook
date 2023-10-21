import React from 'react';
import { shallow } from 'enzyme';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import messages from './StatusAlerts.messages';
import {
  StatusAlerts,
  mapDispatchToProps,
  mapStateToProps,
} from './StatusAlerts';

jest.mock('@edx/paragon', () => ({
  Alert: 'Alert',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      courseGradeFilterValidity: (state) => ({ courseGradeFilterValidity: state }),
      assignmentGradeFilterValidity: (state) => ({ assignmentGradeFilterValidity: state }),
    },
    grades: {
      showSuccess: (state) => ({ showSuccess: state }),
    },
  },
}));

describe('StatusAlerts', () => {
  let props = {
    showSuccessBanner: true,
    courseLimitValidity: {
      isMaxValid: true,
      isMinValid: true,
      isMinLessMaxValid: true,
    },
    assignmentLimitValidity: {
      isMaxValid: true,
      isMinValid: true,
      isMinLessMaxValid: true,
    },
  };

  beforeEach(() => {
    props = {
      ...props,
      handleCloseSuccessBanner: jest.fn().mockName('handleCloseSuccessBanner'),
    };
  });

  describe('snapshots', () => {
    let el;
    it('basic snapshot', () => {
      el = shallow(<StatusAlerts {...props} />);
      const courseGradeFilterAlertDialogText = 'Course grade text';
      const assignmentGradeFilterAlertDialogText = 'Assignment grade text';
      jest.spyOn(
        el.instance(),
        'courseGradeFilterAlertDialogText',
        'get',
      ).mockReturnValue(courseGradeFilterAlertDialogText);
      jest.spyOn(
        el.instance(),
        'assignmentGradeFilterAlertDialogText',
        'get',
      ).mockReturnValue(assignmentGradeFilterAlertDialogText);
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('behavior course grade', () => {
    it.each([
      [false, false, false],
      [false, true, false],
      [false, false, true],
      [true, false, false],
      [true, true, false],
      [true, true, true],
    ])('min + max + min less max course grade validity', (isMinValid, isMaxValid, isMinLessMaxValid) => {
      props = {
        ...props,
        courseLimitValidity: {
          isMinValid,
          isMaxValid,
          isMinLessMaxValid,
        },
      };
      const el = shallow(<StatusAlerts {...props} />);
      expect(
        el.instance().isCourseGradeFilterAlertOpen,
      ).toEqual(
        !isMinValid || !isMaxValid || !isMinLessMaxValid,
      );
      if (!isMinValid && !isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minGradeInvalid} />{' '}
            <FormattedMessage {...messages.maxGradeInvalid} />{' '}
            <FormattedMessage {...messages.minLessMaxGradeInvalid} />
          </>,
        );
      }
      if (!isMinValid && isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minGradeInvalid} />{' '}{''}{' '}
            <FormattedMessage {...messages.minLessMaxGradeInvalid} />
          </>,
        );
      }
      if (!isMinValid && !isMaxValid && isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minGradeInvalid} />{' '}
            <FormattedMessage {...messages.maxGradeInvalid} />{' '}{''}
          </>,
        );
      }
      if (isMinValid && !isMaxValid && isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.maxGradeInvalid} />{' '}{''}
          </>,
        );
      }
      if (!isMinValid && isMaxValid && isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            {' '}
            <FormattedMessage {...messages.minGradeInvalid} />
            {' '}
          </>,
        );
      }
      if (isMinValid && isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().courseGradeFilterAlertDialogText).toEqual(
          <>
            {''}{' '}{''}{' '}<FormattedMessage {...messages.minLessMaxGradeInvalid} />
          </>,
        );
      }
    });
  });

  describe('behavior assignment grade', () => {
    it.each([
      [false, false, false],
      [false, true, false],
      [false, false, true],
      [true, false, false],
      [true, true, false],
      [true, true, true],
    ])('min + max + min less max course grade validity', (isMinValid, isMaxValid, isMinLessMaxValid) => {
      props = {
        ...props,
        assignmentLimitValidity: {
          isMinValid,
          isMaxValid,
          isMinLessMaxValid,
        },
      };
      const el = shallow(<StatusAlerts {...props} />);
      expect(
        el.instance().isAssignmentGradeFilterAlertOpen,
      ).toEqual(
        !isMinValid || !isMaxValid || !isMinLessMaxValid,
      );
      if (!isMinValid && !isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minAssignmentInvalid} />{' '}
            <FormattedMessage {...messages.maxAssignmentInvalid} />{' '}
            <FormattedMessage {...messages.minLessMaxAssignmentInvalid} />
          </>,
        );
      }
      if (!isMinValid && isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minAssignmentInvalid} />{' '}{''}{' '}
            <FormattedMessage {...messages.minLessMaxAssignmentInvalid} />
          </>,
        );
      }
      if (!isMinValid && !isMaxValid && isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.minAssignmentInvalid} />{' '}
            <FormattedMessage {...messages.maxAssignmentInvalid} />{' '}{''}
          </>,
        );
      }
      if (isMinValid && !isMaxValid && isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            <FormattedMessage {...messages.maxAssignmentInvalid} />{' '}{''}
          </>,
        );
      }
      if (!isMinValid && isMaxValid && isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            {' '}
            <FormattedMessage {...messages.minAssignmentInvalid} />
            {' '}
          </>,
        );
      }
      if (isMinValid && isMaxValid && !isMinLessMaxValid) {
        expect(el.instance().assignmentGradeFilterAlertDialogText).toEqual(
          <>
            {''}{' '}{''}{' '}<FormattedMessage {...messages.minLessMaxAssignmentInvalid} />
          </>,
        );
      }
    });
  });

  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('courseLimitValidity from app.courseGradeFitlerValidity', () => {
      expect(mapped.courseLimitValidity).toEqual(selectors.app.courseGradeFilterValidity(testState));
    });
    test('assignmentLimitValidity from app.assignmentGradeFitlerValidity', () => {
      expect(mapped.assignmentLimitValidity).toEqual(selectors.app.assignmentGradeFilterValidity(testState));
    });
    test('showSuccessBanner from grades.showSuccess', () => {
      expect(mapped.showSuccessBanner).toEqual(selectors.grades.showSuccess(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('handleCloseSuccessBanner from actions.grades.banner.close', () => {
      expect(
        mapDispatchToProps.handleCloseSuccessBanner,
      ).toEqual(actions.grades.banner.close);
    });
  });
});
