import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@openedx/paragon';

import { formatMessage } from 'testUtils';

import AssignmentTypeFilter from './AssignmentTypeFilter';
import AssignmentFilter from './AssignmentFilter';
import AssignmentGradeFilter from './AssignmentGradeFilter';
import CourseGradeFilter from './CourseGradeFilter';
import StudentGroupsFilter from './StudentGroupsFilter';
import messages from './messages';

import useGradebookFiltersData from './hooks';
import GradebookFilters from '.';

jest.mock('./AssignmentTypeFilter', () => 'AssignmentTypeFilter');
jest.mock('./AssignmentFilter', () => 'AssignmentFilter');
jest.mock('./AssignmentGradeFilter', () => 'AssignmentGradeFilter');
jest.mock('./CourseGradeFilter', () => 'CourseGradeFilter');
jest.mock('./StudentGroupsFilter', () => 'StudentGroupsFilter');

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const hookProps = {
  closeMenu: jest.fn().mockName('hook.closeMenu'),
  includeCourseTeamMembers: {
    value: true,
    handleChange: jest.fn().mockName('hook.handleChange'),
  },
};
useGradebookFiltersData.mockReturnValue(hookProps);

let el;
const updateQueryParams = jest.fn();

describe('GradebookFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<GradebookFilters updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useGradebookFiltersData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('Assignment filters', () => {
      expect(el.instance.findByType(Collapsible)[0].children[0]).toMatchObject(shallow(
        <div>
          <AssignmentTypeFilter updateQueryParams={updateQueryParams} />
          <AssignmentFilter updateQueryParams={updateQueryParams} />
          <AssignmentGradeFilter updateQueryParams={updateQueryParams} />
        </div>,
      ));
    });
    test('CourseGrade filters', () => {
      expect(el.instance.findByType(Collapsible)[1].children[0]).toMatchObject(shallow(
        <CourseGradeFilter updateQueryParams={updateQueryParams} />,
      ));
    });
    test('StudentGroups filters', () => {
      expect(el.instance.findByType(Collapsible)[2].children[0]).toMatchObject(shallow(
        <StudentGroupsFilter updateQueryParams={updateQueryParams} />,
      ));
    });
    test('includeCourseTeamMembers', () => {
      const checkbox = el.instance.findByType(Collapsible)[3].children[0];
      expect(checkbox.props).toEqual({
        checked: true,
        onChange: hookProps.includeCourseTeamMembers.handleChange,
      });
      expect(checkbox.children[0].el).toEqual(formatMessage(messages.includeCourseTeamMembers));
    });
  });
});
