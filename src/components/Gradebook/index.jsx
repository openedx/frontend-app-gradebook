import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  InputSelect,
  Modal,
  SearchField,
  StatusAlert,
  Table,
  Icon,
  Tabs,
} from '@edx/paragon';
import queryString from 'query-string';
import { configuration } from '../../config';
import PageButtons from '../PageButtons';
import { formatDateForDisplay } from '../../data/actions/utils';

const DECIMAL_PRECISION = 2;
const GRADE_OVERRIDE_HISTORY_COLUMNS = [{ label: 'Date', key: 'date' }, { label: 'Grader', key: 'grader' },
  { label: 'Reason', key: 'reason' },
  { label: 'Adjusted grade', key: 'adjustedGrade' }];

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: '',
      modalOpen: false,
      adjustedGradeValue: 0,
      updateModuleId: null,
      updateUserId: null,
      reasonForChange: '',
    };
    this.fileFormRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.getRoles(this.props.courseId, urlQuery);
    this.overrideReasonInput.focus();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  setNewModalState = (userEntry, subsection) => {
    this.props.fetchGradeOverrideHistory(
      subsection.module_id,
      userEntry.user_id,
    );

    let adjustedGradePossible = '100';
    if (subsection.attempted) {
      adjustedGradePossible = ` / ${subsection.score_possible}`;
    }
    this.setState({
      modalAssignmentName: `${subsection.subsection_name}`,
      modalOpen: true,
      updateModuleId: subsection.module_id,
      updateUserId: userEntry.user_id,
      updateUserName: userEntry.username,
      todaysDate: formatDateForDisplay(new Date()),
      originalGrade: subsection.score_earned,
      adjustedGradePossible,
      reasonForChange: '',
      adjustedGradeValue: '',
    });
  }

  getLearnerInformation = entry => (
    <div>
      <div>{entry.username}</div>
      {entry.external_user_key && <div className="student-key">{entry.external_user_key}</div>}
    </div>
  )

  getActiveTabs = () => {
    if (this.props.showBulkManagement) {
      return ['Grades', 'Bulk Management'];
    }
    return ['Grades'];
  };

  handleAdjustedGradeClick = () => {
    this.props.updateGrades(
      this.props.courseId, [
        {
          user_id: this.state.updateUserId,
          usage_id: this.state.updateModuleId,
          grade: {
            earned_graded_override: this.state.adjustedGradeValue,
            comment: this.state.reasonForChange,
          },
        },
      ],
      this.state.filterValue,
      this.props.selectedCohort,
      this.props.selectedTrack,
    );

    this.setState({
      modalOpen: false,
      updateModuleId: null,
      updateUserId: null,
      reasonForChange: '',
      adjustedGradeValue: '',
    });
  }

  updateQueryParams = (queryKey, queryValue) => {
    const parsed = queryString.parse(this.props.location.search);
    parsed[queryKey] = queryValue;
    return `?${queryString.stringify(parsed)}`;
  };

  mapAssignmentTypeEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry,
      label: entry,
    }));
    mapped.unshift({ id: 0, label: 'All' });
    return mapped;
  };

  mapCohortsEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry.id,
      label: entry.name,
    }));
    mapped.unshift({ id: 0, label: 'Cohort-All' });
    return mapped;
  };

  mapTracksEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry.slug,
      label: entry.name,
    }));
    mapped.unshift({ label: 'Track-All' });
    return mapped;
  };

  updateAssignmentTypes = (event) => {
    this.props.filterColumns(event, this.props.grades[0]);
    const updatedQueryStrings = this.updateQueryParams('assignmentType', event);
    this.props.history.push(updatedQueryStrings);
  }

  updateTracks = (event) => {
    const selectedTrackItem = this.props.tracks.find(x => x.name === event);
    let selectedTrackSlug = null;
    if (selectedTrackItem) {
      selectedTrackSlug = selectedTrackItem.slug;
    }
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      selectedTrackSlug,
      this.props.selectedAssignmentType,
    );
    const updatedQueryStrings = this.updateQueryParams('track', selectedTrackSlug);
    this.props.history.push(updatedQueryStrings);
  };

  updateCohorts = (event) => {
    const selectedCohortItem = this.props.cohorts.find(x => x.name === event);
    let selectedCohortId = null;
    if (selectedCohortItem) {
      selectedCohortId = selectedCohortItem.id;
    }
    this.props.getUserGrades(
      this.props.courseId,
      selectedCohortId,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
    this.updateQueryParams('cohort', selectedCohortId);
  };

  handleClickExportGrades = () => {
    window.location = this.props.gradeExportUrl;
  };

  handleClickImportGrades = () => {
    const fileInput = this.fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  handleFileInputChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const form = this.fileFormRef.current;
    if (file && form) {
      const formData = new FormData(form);
      this.props.submitFileUploadFormData(this.props.courseId, formData).then(() => {
        fileInput.value = null;
      });
    }
  };

  mapSelectedCohortEntry = (entry) => {
    const selectedCohortEntry = this.props.cohorts.find(x => x.id === parseInt(entry, 10));
    if (selectedCohortEntry) {
      return selectedCohortEntry.name;
    }
    return 'Cohorts';
  };

  mapSelectedTrackEntry = (entry) => {
    const selectedTrackEntry = this.props.tracks.find(x => x.slug === entry);
    if (selectedTrackEntry) {
      return selectedTrackEntry.name;
    }
    return 'Tracks';
  };

  roundGrade = percent => parseFloat((percent || 0).toFixed(DECIMAL_PRECISION));

  formatter = {
    percent: (entries, areGradesFrozen) => entries.map((entry) => {
      const learnerInformation = this.getLearnerInformation(entry);
      const results = { Username: learnerInformation, Email: entry.email };

      const assignments = entry.section_breakdown
        .reduce((acc, subsection) => {
          if (areGradesFrozen) {
            acc[subsection.label] = `${this.roundGrade(subsection.percent * 100)} %`;
          } else {
            acc[subsection.label] = (
              <button
                className="btn btn-header link-style grade-button"
                onClick={() => this.setNewModalState(entry, subsection)}
              >
                {this.roundGrade(subsection.percent * 100)}%
              </button>);
          }
          return acc;
        }, {});
      const totals = { Total: `${this.roundGrade(entry.percent * 100)}%` };
      return Object.assign(results, assignments, totals);
    }),

    absolute: (entries, areGradesFrozen) => entries.map((entry) => {
      const learnerInformation = this.getLearnerInformation(entry);
      const results = { Username: learnerInformation, Email: entry.email };

      const assignments = entry.section_breakdown
        .reduce((acc, subsection) => {
          const scoreEarned = this.roundGrade(subsection.score_earned);
          const scorePossible = this.roundGrade(subsection.score_possible);
          let label = `${scoreEarned}`;
          if (subsection.attempted) {
            label = `${scoreEarned}/${scorePossible}`;
          }
          if (areGradesFrozen) {
            acc[subsection.label] = label;
          } else {
            acc[subsection.label] = (
              <button
                className="btn btn-header link-style"
                onClick={() => this.setNewModalState(entry, subsection)}
              >
                {label}
              </button>
            );
          }
          return acc;
        }, {});

      const totals = { Total: `${this.roundGrade(entry.percent * 100)}/100` };
      return Object.assign(results, assignments, totals);
    }),
  };

  lmsInstructorDashboardUrl = courseId => `${configuration.LMS_BASE_URL}/courses/${courseId}/instructor`;

  formatHeadings = () => {
    let headings = [...this.props.headings];

    if (headings.length > 0) {
      const userInformationHeadingLabel = (
        <div>
          <div>Username</div>
          <div className="font-weight-normal student-key">Student Key</div>
        </div>
      );

      headings = headings.map(heading => ({ label: heading, key: heading }));

      // replace username heading label to include additional user data
      headings[0].label = userInformationHeadingLabel;
    }

    return headings;
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        {this.props.showSpinner && <div className="spinner-overlay"><Icon className={['fa', 'fa-spinner', 'fa-spin', 'fa-5x', 'color-black']} /></div>}
        <div className="gradebook-container">
          <div>
            <a
              href={this.lmsInstructorDashboardUrl(this.props.courseId)}
              className="mb-3"
            >
              <span aria-hidden="true">{'<< '}</span> {'Back to Dashboard'}
            </a>
            <h1>Gradebook</h1>
            <h3> {this.props.courseId}</h3>
            {this.props.areGradesFrozen &&
              <div className="alert alert-warning" role="alert" >
                The grades for this course are now frozen. Editing of grades is no longer allowed.
              </div>
            }
            {(this.props.canUserViewGradebook === false) &&
              <div className="alert alert-warning" role="alert" >
                You are not authorized to view the gradebook for this course.
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between" >
              <div>
                <div role="radiogroup" aria-labelledby="score-view-group-label">
                  <span id="score-view-group-label">Score View:</span>
                  <span>
                    <label className="mr-2" htmlFor="score-view-percent">
                      <input
                        id="score-view-percent"
                        className="ml-2 mr-1"
                        type="radio"
                        name="score-view"
                        value="percent"
                        defaultChecked
                        onClick={() => this.props.toggleFormat('percent')}
                      />
                      Percent
                    </label>
                  </span>
                  <span>
                    <label htmlFor="score-view-absolute">
                      <input
                        id="score-view-absolute"
                        type="radio"
                        name="score-view"
                        value="absolute"
                        className="mr-1"
                        onClick={() => this.props.toggleFormat('absolute')}
                      />
                      Absolute
                    </label>
                  </span>
                </div>
                {this.props.assignmentTypes.length > 0 &&
                  <div className="student-filters">
                    <span className="label">
                      Assignment Types:
                    </span>
                    <InputSelect
                      name="assignment-types"
                      ariaLabel="Assignment Types"
                      value={this.props.selectedAssignmentType}
                      options={this.mapAssignmentTypeEntries(this.props.assignmentTypes)}
                      onChange={this.updateAssignmentTypes}
                    />
                  </div>
                }
                <div className="student-filters">
                  <span className="label">
                    Student Groups:
                  </span>
                  <InputSelect
                    name="Tracks"
                    ariaLabel="Tracks"
                    disabled={this.props.tracks.length === 0}
                    value={this.mapSelectedTrackEntry(this.props.selectedTrack)}
                    options={this.mapTracksEntries(this.props.tracks)}
                    onChange={this.updateTracks}
                  />
                  <InputSelect
                    name="Cohorts"
                    ariaLabel="Cohorts"
                    disabled={this.props.cohorts.length === 0}
                    value={this.mapSelectedCohortEntry(this.props.selectedCohort)}
                    options={this.mapCohortsEntries(this.props.cohorts)}
                    onChange={this.updateCohorts}
                  />
                </div>
              </div>
              <div>
                <SearchField
                  onSubmit={value =>
                    this.props.searchForUser(
                      this.props.courseId,
                      value,
                      this.props.selectedCohort,
                      this.props.selectedTrack,
                      this.props.selectedAssignmentType,
                    )
                  }
                  inputLabel="Search for a learner"
                  onChange={filterValue => this.setState({ filterValue })}
                  onClear={() =>
                    this.props.getUserGrades(
                      this.props.courseId,
                      this.props.selectedCohort,
                      this.props.selectedTrack,
                      this.props.selectedAssignmentType,
                    )
                  }
                  value={this.state.filterValue}
                />
                <small className="form-text text-muted search-help-text">Search by username, email, or student key</small>
              </div>
            </div>
            <Tabs labels={this.getActiveTabs()}>
              <div>
                <StatusAlert
                  alertType="success"
                  dialog="The grade has been successfully edited."
                  onClose={() => this.props.closeBanner()}
                  open={this.props.showSuccess}
                />
                <div className="gbook">
                  <Table
                    columns={this.formatHeadings()}
                    data={this.formatter[this.props.format](
                      this.props.grades,
                      this.props.areGradesFrozen,
                    )}
                    rowHeaderColumnKey="username"
                  />
                </div>
                {PageButtons(this.props)}
                <Modal
                  open={this.state.modalOpen}
                  title="Edit Grades"
                  closeText="Cancel"
                  body={(
                    <div>
                      <div>
                        <div className="grade-history-header grade-history-assignment">Assignment: </div> <div>{this.state.modalAssignmentName}</div>
                        <div className="grade-history-header grade-history-student">Student: </div> <div>{this.state.updateUserName}</div>
                        <div className="grade-history-header grade-history-original-grade">Original Grade: </div> <div>{this.state.originalGrade}</div>
                        <div className="grade-history-header grade-history-current-grade">Current Grade: </div> <div>{this.props.gradeOverrideCurrentEarnedGradedOverride}</div>
                      </div>
                      <StatusAlert
                        alertType="danger"
                        dialog="Error retrieving grade override history."
                        open={this.props.errorFetchingGradeOverrideHistory}
                        dismissible={false}
                      />
                      {!this.props.errorFetchingGradeOverrideHistory && (
                        <Table
                          columns={GRADE_OVERRIDE_HISTORY_COLUMNS}
                          data={[...this.props.gradeOverrides, {
                            date: this.state.todaysDate,
                            grader: this.state.updateUserName,
                            reason: (<input
                              type="text"
                              name="reasonForChange"
                              value={this.state.reasonForChange}
                              onChange={value => this.onChange(value)}
                              ref={(input) => { this.overrideReasonInput = input; }}
                            />),
                            adjustedGrade: (
                              <span>
                                <input
                                  type="text"
                                  name="adjustedGradeValue"
                                  value={this.state.adjustedGradeValue}
                                  onChange={value => this.onChange(value)}
                                /> {this.state.adjustedGradePossible}
                              </span>),
                          }]}
                        />)}

                      <div>Showing most recent actions(max 5). To see more, please contact
                      support.
                      </div>
                      <div>Note: Once you save, your changes will be visible to students.</div>
                    </div>
                  )}
                  buttons={[
                    <Button
                      label="Save Grade"
                      buttonType="primary"
                      onClick={this.handleAdjustedGradeClick}
                    />,
                  ]}
                  onClose={() => this.setState({
                    modalOpen: false,
                    adjustedGradeValue: 0,
                    updateModuleId: null,
                    updateUserId: null,
                    reasonForChange: '',
                  })}
                />
              </div>
              {this.props.showBulkManagement && (
                <div>
                  <form ref={this.fileFormRef} action={this.props.gradeExportUrl} method="post">
                    <StatusAlert
                      alertType="danger"
                      dialog={this.props.bulkImportError}
                      open={this.props.bulkImportError}
                      dismissible={false}
                    />
                    <input
                      className="d-none"
                      type="file"
                      name="csv"
                      label="Upload Grade CSV"
                      onChange={this.handleFileInputChange}
                      ref={this.fileInputRef}
                    />
                  </form>
                  <Button
                    label="Export Grades"
                    buttonType="primary"
                    onClick={this.handleClickExportGrades}
                  />
                  <Button
                    label="Import Grades"
                    buttonType="primary"
                    onClick={this.handleClickImportGrades}
                  />
                  <Table
                    data={this.props.bulkManagementHistory}
                    columns={[
                      { key: 'user', label: 'Uploaded By', columnSortable: false },
                      { key: 'operation', label: 'Operation', columnSortable: false },
                      { key: 'modified', label: 'Uploaded Date', columnSortable: false },
                    ]}
                  />
                </div>)}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

Gradebook.defaultProps = {
  areGradesFrozen: false,
  assignmentTypes: [],
  canUserViewGradebook: false,
  cohorts: [],
  grades: [],
  gradeOverrides: [],
  gradeOverrideCurrentEarnedGradedOverride: null,
  location: {
    search: '',
  },
  courseId: '',
  selectedCohort: null,
  selectedTrack: null,
  selectedAssignmentType: 'All',
  showSpinner: false,
  tracks: [],
  bulkImportError: '',
  showBulkManagement: false,
  bulkManagementHistory: [],
  errorFetchingGradeOverrideHistory: false,
};

Gradebook.propTypes = {
  areGradesFrozen: PropTypes.bool,
  assignmentTypes: PropTypes.arrayOf(PropTypes.string),
  canUserViewGradebook: PropTypes.bool,
  cohorts: PropTypes.arrayOf(PropTypes.string),
  filterColumns: PropTypes.func.isRequired,
  format: PropTypes.string.isRequired,
  getRoles: PropTypes.func.isRequired,
  getUserGrades: PropTypes.func.isRequired,
  fetchGradeOverrideHistory: PropTypes.func.isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    percent: PropTypes.number,
    section_breakdown: PropTypes.arrayOf(PropTypes.shape({
      attempted: PropTypes.bool,
      category: PropTypes.string,
      label: PropTypes.string,
      module_id: PropTypes.string,
      percent: PropTypes.number,
      scoreEarned: PropTypes.number,
      scorePossible: PropTypes.number,
      subsection_name: PropTypes.string,
    })),
    user_id: PropTypes.number,
    user_name: PropTypes.string,
  })),
  gradeOverrides: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    grader: PropTypes.string,
    reason: PropTypes.string,
    adjustedGrade: PropTypes.number,
  })),
  gradeOverrideCurrentEarnedGradedOverride: PropTypes.number,
  headings: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  courseId: PropTypes.string,
  searchForUser: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.shape({
    name: PropTypes.string,
  }),
  selectedTrack: PropTypes.string,
  showSpinner: PropTypes.bool,
  showSuccess: PropTypes.bool.isRequired,
  toggleFormat: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  closeBanner: PropTypes.func.isRequired,
  updateGrades: PropTypes.func.isRequired,
  gradeExportUrl: PropTypes.string.isRequired,
  submitFileUploadFormData: PropTypes.func.isRequired,
  bulkImportError: PropTypes.string,
  errorFetchingGradeOverrideHistory: PropTypes.bool,
  showBulkManagement: PropTypes.bool,
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    operation: PropTypes.oneOf(['commit', 'error']),
    user: PropTypes.string,
    modified: PropTypes.string,
  })),
};
