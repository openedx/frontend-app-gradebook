/* eslint-disable react/sort-comp, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Collapsible,
  Icon,
  IconButton,
  Form,
} from '@edx/paragon';
import { Close } from '@edx/paragon/icons';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import AssignmentTypeFilter from './AssignmentTypeFilter';
import AssignmentFilter from './AssignmentFilter';
import AssignmentGradeFilter from './AssignmentGradeFilter';
import CourseGradeFilter from './CourseGradeFilter';
import StudentGroupsFilter from './StudentGroupsFilter';

export class GradebookFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      includeCourseRoleMembers: this.props.includeCourseRoleMembers,
    };
    this.handleIncludeTeamMembersChange = this.handleIncludeTeamMembersChange.bind(this);
  }

  handleIncludeTeamMembersChange(event) {
    const includeCourseRoleMembers = event.target.checked;
    this.setState({ includeCourseRoleMembers });
    this.props.updateIncludeCourseRoleMembers(includeCourseRoleMembers);
    this.props.fetchGrades();
    this.props.updateQueryParams({ includeCourseRoleMembers });
  }

  collapsibleGroup = (title, content) => (
    <Collapsible title={title} defaultOpen className="filter-group mb-3">
      {content}
    </Collapsible>
  );

  render() {
    const {
      updateQueryParams,
    } = this.props;
    return (
      <>
        <div className="filter-sidebar-header">
          <h2><Icon className="fa fa-filter" /></h2>
          <IconButton
            className="p-1"
            onClick={this.props.closeMenu}
            iconAs={Icon}
            src={Close}
            alt="Close Filters"
            aria-label="Close Filters"
          />
        </div>

        {this.collapsibleGroup('Assignments', (
          <div>
            <AssignmentTypeFilter updateQueryParams={updateQueryParams} />
            <AssignmentFilter updateQueryParams={updateQueryParams} />
            <AssignmentGradeFilter updateQueryParams={updateQueryParams} />
          </div>
        ))}

        {this.collapsibleGroup('Overall Grade', (
          <CourseGradeFilter updateQueryParams={updateQueryParams} />
        ))}

        {this.collapsibleGroup('Student Groups', (
          <StudentGroupsFilter updateQueryParams={updateQueryParams} />
        ))}

        {this.collapsibleGroup('Include Course Team Members', (
          <Form.Checkbox
            checked={this.state.includeCourseRoleMembers}
            onChange={this.handleIncludeTeamMembersChange}
          >
            Include Course Team Members
          </Form.Checkbox>
        ))}
      </>
    );
  }
}
GradebookFilters.defaultProps = {
  includeCourseRoleMembers: false,
};
GradebookFilters.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
  // redux
  closeMenu: PropTypes.func.isRequired,
  fetchGrades: PropTypes.func.isRequired,
  includeCourseRoleMembers: PropTypes.bool,
  updateIncludeCourseRoleMembers: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  includeCourseRoleMembers: selectors.filters.includeCourseRoleMembers(state),
});

export const mapDispatchToProps = {
  closeMenu: thunkActions.app.filterMenu.close,
  fetchGrades: thunkActions.grades.fetchGrades,
  updateIncludeCourseRoleMembers: actions.filters.update.includeCourseRoleMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookFilters);
