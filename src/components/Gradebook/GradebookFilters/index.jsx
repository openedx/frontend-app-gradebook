/* eslint-disable react/sort-comp, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Collapsible, Form } from '@edx/paragon';

import * as filterActions from 'data/actions/filters';

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

  handleIncludeTeamMembersChange(includeCourseRoleMembers) {
    this.setState({ includeCourseRoleMembers });
    this.props.updateIncludeCourseRoleMembers(includeCourseRoleMembers);
    this.props.updateQueryParams({ includeCourseRoleMembers });
  }

  collapsibleGroup = (title, content) => (
    <Collapsible title={title} defaultOpen className="filter-group mb-3">
      {content}
    </Collapsible>
  );

  render() {
    const {
      courseId,
      filterValues,
      setFilters,
      updateQueryParams,
    } = this.props;
    return (
      <>
        {this.collapsibleGroup('Assignments', (
          <div>
            <AssignmentTypeFilter
              updateQueryParams={updateQueryParams}
            />
            <AssignmentFilter
              courseId={courseId}
              updateQueryParams={updateQueryParams}
            />
            <AssignmentGradeFilter
              {...{
                courseId,
                filterValues,
                setFilters,
                updateQueryParams,
              }}
            />
          </div>
        ))}
        {this.collapsibleGroup('Overall Grade', (
          <CourseGradeFilter
            {...{
              filterValues,
              setFilters,
              courseId,
              updateQueryParams,
            }}
          />
        ))}
        {this.collapsibleGroup('Student Groups', (
          <StudentGroupsFilter
            courseId={courseId}
            updateQueryParams={updateQueryParams}
          />
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
GradebookFilters.propTypes = {
  courseId: PropTypes.string.isRequired,
  filterValues: PropTypes.shape({
    assignmentGradeMin: PropTypes.string,
    assignmentGradeMax: PropTypes.string,
    courseGradeMin: PropTypes.string,
    courseGradeMax: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  includeCourseRoleMembers: PropTypes.bool.isRequired,
  updateIncludeCourseRoleMembers: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  includeCourseRoleMembers: state.filters.includeCourseRoleMembers,
});

export const mapDispatchToProps = {
  updateIncludeCourseRoleMembers: filterActions.updateIncludeCourseRoleMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookFilters);
