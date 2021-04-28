import React from 'react';
import { shallow } from 'enzyme';
import {
  StatusAlerts,
  mapDispatchToProps,
  mapStateToProps,
  maxCourseGradeInvalidMessage,
  minCourseGradeInvalidMessage,
} from './StatusAlerts';
import { closeBanner } from '../../data/actions/grades';

jest.mock('@edx/paragon', () => ({
  StatusAlert: 'StatusAlert',
}));

describe('StatusAlerts', () => {
  let props = {
    showSuccessBanner: true,
    isMaxCourseGradeFilterValid: true,
    isMinCourseGradeFilterValid: true,
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
    ])('min + max course grade validity', (isMinCourseGradeFilterValid, isMaxCourseGradeFilterValid) => {
      props = {
        ...props,
        isMinCourseGradeFilterValid,
        isMaxCourseGradeFilterValid,
      };
      const el = shallow(<StatusAlerts {...props} />);
      expect(
        el.instance().isCourseGradeFilterAlertOpen,
      ).toEqual(
        !isMinCourseGradeFilterValid || !isMaxCourseGradeFilterValid,
      );
      if (!isMaxCourseGradeFilterValid) {
        expect(
          el.instance().courseGradeFilterAlertDialogText,
        ).toEqual(
          expect.stringContaining(maxCourseGradeInvalidMessage),
        );
      }
      if (!isMinCourseGradeFilterValid) {
        expect(
          el.instance().courseGradeFilterAlertDialogText,
        ).toEqual(
          expect.stringContaining(minCourseGradeInvalidMessage),
        );
      }
    });
  });

  describe('mapStateToProps', () => {
    it('showSuccessBanner', () => {
      const arbitraryValue = 'AppleBananaCucumber';
      const state = {
        grades: {
          showSuccess: arbitraryValue,
        },
      };
      expect(mapStateToProps(state).showSuccessBanner).toBe(arbitraryValue);
    });
  });
  describe('handleCloseSuccessBanner', () => {
    test('handleCloseSuccessBanner', () => {
      expect(
        mapDispatchToProps.handleCloseSuccessBanner,
      ).toEqual(
        closeBanner,
      );
    });
  });
});
