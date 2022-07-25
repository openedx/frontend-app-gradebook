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
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import messages from './messages';
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
    <Collapsible
      title={<FormattedMessage {...title} />}
      defaultOpen
      className="filter-group mb-3"
    >
      {content}
    </Collapsible>
  );

  render() {
    const {
      intl,
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
            alt={intl.formatMessage(messages.closeFilters)}
            aria-label={intl.formatMessage(messages.closeFilters)}
          />
        </div>

        {this.collapsibleGroup(
          messages.assignments, (
            <div>
              <AssignmentTypeFilter updateQueryParams={updateQueryParams} />
              <AssignmentFilter updateQueryParams={updateQueryParams} />
              <AssignmentGradeFilter updateQueryParams={updateQueryParams} />
            </div>
          ),
        )}

        {this.collapsibleGroup(
          messages.overallGrade, (
            <CourseGradeFilter updateQueryParams={updateQueryParams} />
          ),
        )}

        {this.collapsibleGroup(
          messages.studentGroups, (
            <StudentGroupsFilter updateQueryParams={updateQueryParams} />
          ),
        )}

        {this.collapsibleGroup(
          messages.includeCourseTeamMembers, (
            <Form.Checkbox
              checked={this.state.includeCourseRoleMembers}
              onChange={this.handleIncludeTeamMembersChange}
            >
              <FormattedMessage {...messages.includeCourseTeamMembers} />
            </Form.Checkbox>
          ),
        )}
      </>
    );
  }
}
GradebookFilters.defaultProps = {
  includeCourseRoleMembers: false,
};
GradebookFilters.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GradebookFilters));
