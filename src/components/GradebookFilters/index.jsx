import PropTypes from 'prop-types';
import {
  Collapsible,
  Icon,
  IconButton,
  Form,
} from '@openedx/paragon';
import { Close, FilterAlt } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades } from '@src/components/GradesView/data/hooks';

import messages from './messages';
import AssignmentTypeFilter from './AssignmentTypeFilter';
import AssignmentFilter from './AssignmentFilter';
import AssignmentGradeFilter from './AssignmentGradeFilter';
import CourseGradeFilter from './CourseGradeFilter';
import StudentGroupsFilter from './StudentGroupsFilter';

export const GradebookFilters = ({ updateQueryParams }) => {
  const { formatMessage } = useIntl();
  const { includeCourseRoleMembers, setIncludeCourseRoleMembers } = useFilters();
  const { closeFilterMenu } = useGradebookUi();
  const fetchGrades = useRefetchGrades();

  const handleIncludeTeamMembersChange = ({ target: { checked } }) => {
    setIncludeCourseRoleMembers(checked);
    fetchGrades();
    updateQueryParams({ includeCourseRoleMembers: checked });
  };

  const collapsibleClassName = 'filter-group mb-3';
  return (
    <>
      <div className="filter-sidebar-header">
        <h2><Icon src={FilterAlt} /></h2>
        <IconButton
          className="p-1"
          onClick={closeFilterMenu}
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
          checked={includeCourseRoleMembers}
          onChange={handleIncludeTeamMembersChange}
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
