import React from 'react';
import PropTypes from 'prop-types';

import {
  Collapsible,
  Icon,
  IconButton,
  Form,
} from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import AssignmentTypeFilter from './AssignmentTypeFilter';
import AssignmentFilter from './AssignmentFilter';
import AssignmentGradeFilter from './AssignmentGradeFilter';
import CourseGradeFilter from './CourseGradeFilter';
import StudentGroupsFilter from './StudentGroupsFilter';
import useGradebookFiltersData from './hooks';

export const GradebookFilters = ({ updateQueryParams }) => {
  const {
    closeMenu,
    includeCourseTeamMembers,
  } = useGradebookFiltersData({ updateQueryParams });
  const { formatMessage } = useIntl();
  const collapsibleClassName = 'filter-group mb-3';
  return (
    <>
      <div className="filter-sidebar-header">
        <h2><Icon className="fa fa-filter" /></h2>
        <IconButton
          className="p-1"
          onClick={closeMenu}
          iconAs={Icon}
          src={Close}
          alt={formatMessage(messages.closeFilters)}
          aria-label={formatMessage(messages.closeFilters)}
        />
      </div>

      <Collapsible
        title={formatMessage(messages.assignments)}
        defaultOpen
        className={collapsibleClassName}
      >
        <div>
          <AssignmentTypeFilter updateQueryParams={updateQueryParams} />
          <AssignmentFilter updateQueryParams={updateQueryParams} />
          <AssignmentGradeFilter updateQueryParams={updateQueryParams} />
        </div>
      </Collapsible>

      <Collapsible
        title={formatMessage(messages.overallGrade)}
        defaultOpen
        className={collapsibleClassName}
      >
        <CourseGradeFilter updateQueryParams={updateQueryParams} />
      </Collapsible>

      <Collapsible
        title={formatMessage(messages.studentGroups)}
        defaultOpen
        className={collapsibleClassName}
      >
        <StudentGroupsFilter updateQueryParams={updateQueryParams} />
      </Collapsible>

      <Collapsible
        title={formatMessage(messages.includeCourseTeamMembers)}
        defaultOpen
        className={collapsibleClassName}
      >
        <Form.Checkbox
          checked={includeCourseTeamMembers.value}
          onChange={includeCourseTeamMembers.handleChange}
        >
          {formatMessage(messages.includeCourseTeamMembers)}
        </Form.Checkbox>
      </Collapsible>
    </>
  );
};
GradebookFilters.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default GradebookFilters;
