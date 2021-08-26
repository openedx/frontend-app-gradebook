import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { views } from 'data/constants/app';
import messages from './messages';
import { GradebookHeader, mapDispatchToProps, mapStateToProps } from '.';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  defineMessages: m => m,
  FormattedMessage: () => 'FormattedMessage',
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: { setView: jest.fn() },
  },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      activeView: jest.fn(state => ({ aciveView: state })),
      courseId: jest.fn(state => ({ courseId: state })),
    },
    assignmentTypes: { areGradesFrozen: jest.fn(state => ({ areGradesFrozen: state })) },
    roles: { canUserViewGradebook: jest.fn(state => ({ canUserViewGradebook: state })) },
    root: { showBulkManagement: jest.fn(state => ({ showBulkManagement: state })) },
  },
}));

const courseId = 'fakeID';
describe('GradebookHeader component', () => {
  const props = {
    activeView: views.grades,
    areGradesFrozen: false,
    canUserViewGradebook: false,
    courseId,
    showBulkManagement: false,
  };
  beforeEach(() => {
    props.setView = jest.fn();
  });
  describe('snapshots', () => {
    let el;
    beforeEach(() => {
      el = shallow(<GradebookHeader {...props} />);
      el.instance().handleToggleViewClick = jest.fn().mockName('this.handleToggleViewClick');
    });
    describe('default values (grades frozen, cannot view).', () => {
      test('unauthorized warning, but no grades frozen warning', () => {
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('grades frozen, cannot view', () => {
      test('unauthorized warning, and grades frozen warning.', () => {
        el.setProps({ areGradesFrozen: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('grades frozen, can view.', () => {
      test('grades frozen warning but no unauthorized warning', () => {
        el.setProps({ areGradesFrozen: true, canUserViewGradebook: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('show bulk management, active view is grades view', () => {
      test('toggle view button to activity log', () => {
        el.setProps({ showBulkManagement: true });
        expect(el.find(Button).getElement()).toEqual((
          <Button
            variant="tertiary"
            onClick={el.instance().handleToggleViewClick}
          >
            <FormattedMessage {...messages.toActivityLog} />
          </Button>
        ));
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('show bulk management, active view is bulkManagementHistory view', () => {
      test('toggle view button to grades', () => {
        el.setProps({ showBulkManagement: true, activeView: views.bulkManagementHistory });
        expect(el.find(Button).getElement()).toEqual((
          <Button
            variant="tertiary"
            onClick={el.instance().handleToggleViewClick}
          >
            <FormattedMessage {...messages.toGradesView} />
          </Button>
        ));
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('behavior', () => {
    let el;
    beforeEach(() => {
      el = shallow(<GradebookHeader {...props} />);
    });
    describe('handleToggleViewClick', () => {
      test('calls setView with activity view if activeView is grades', () => {
        el.instance().handleToggleViewClick();
        expect(props.setView).toHaveBeenCalledWith(views.bulkManagementHistory);
      });
      test('calls setView with grades view if activeView is bulkManagementHistory', () => {
        el.setProps({ activeView: views.bulkManagementHistory });
        el.instance().handleToggleViewClick();
        expect(props.setView).toHaveBeenCalledWith(views.grades);
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { a: 'test', example: 'state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('activeView from app.activeView', () => {
      expect(mapped.activeView).toEqual(selectors.app.activeView(testState));
    });
    test('courseId from app.courseId', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
    test('areGradesFrozen from assignmentTypes selector', () => {
      expect(
        mapped.areGradesFrozen,
      ).toEqual(selectors.assignmentTypes.areGradesFrozen(testState));
    });
    test('canUserViewGradebook from roles selector', () => {
      expect(
        mapped.canUserViewGradebook,
      ).toEqual(selectors.roles.canUserViewGradebook(testState));
    });
    test('showBulkManagement from root showBulkManagement selector', () => {
      expect(mapped.showBulkManagement).toEqual(selectors.root.showBulkManagement(testState));
    });
  });

  describe('mapDispatchToProps', () => {
    test('setView from actions.app.setView', () => {
      expect(mapDispatchToProps.setView).toEqual(actions.app.setView);
    });
  });
});
