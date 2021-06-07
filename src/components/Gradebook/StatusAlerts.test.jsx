import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  StatusAlerts,
  mapDispatchToProps,
  mapStateToProps,
  maxCourseGradeInvalidMessage,
  minCourseGradeInvalidMessage,
} from './StatusAlerts';

jest.mock('@edx/paragon', () => ({
  StatusAlert: 'StatusAlert',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      courseGradeFilterValidity: (state) => ({ courseGradeFilterValidity: state }),
    },
    grades: {
      showSuccess: (state) => ({ showSuccess: state }),
    },
  },
}));

describe('StatusAlerts', () => {
  let props = {
    showSuccessBanner: true,
    limitValidity: {
      isMaxValid: true,
      isMinValid: true,
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
      const courseGradeFilterAlertDialogText = 'the quiCk brown does somEthing or other';
      jest.spyOn(
        el.instance(),
        'courseGradeFilterAlertDialogText',
        'get',
      ).mockReturnValue(courseGradeFilterAlertDialogText);
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it.each([
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ])('min + max course grade validity', (isMinValid, isMaxValid) => {
      props = {
        ...props,
        limitValidity: {
          isMinValid,
          isMaxValid,
        },
      };
      const el = shallow(<StatusAlerts {...props} />);
      expect(
        el.instance().isCourseGradeFilterAlertOpen,
      ).toEqual(
        !isMinValid || !isMaxValid,
      );
      if (!isMaxValid) {
        expect(
          el.instance().courseGradeFilterAlertDialogText,
        ).toEqual(
          expect.stringContaining(maxCourseGradeInvalidMessage),
        );
      }
      if (!isMinValid) {
        expect(
          el.instance().courseGradeFilterAlertDialogText,
        ).toEqual(
          expect.stringContaining(minCourseGradeInvalidMessage),
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
    test('limitValidity from app.courseGradeFitlerValidity', () => {
      expect(mapped.limitValidity).toEqual(selectors.app.courseGradeFilterValidity(testState));
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
