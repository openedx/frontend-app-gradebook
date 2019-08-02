import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StatefulButton,
  InputSelect,
  Modal,
  SearchField,
  StatusAlert,
  Table,
  Icon,
  Tabs,
} from '@edx/paragon';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
    this.props.initializeFilters(urlQuery);
    this.props.getRoles(this.props.courseId);
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

    let adjustedGradePossible = '';

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

  getAssignmentFilterOptions = () => [
    { label: 'All', value: '' },
    ...this.props.assignmentFilterOptions.map((assignment) => {
      const { label, subsectionLabel } = assignment;
      return {
        label: `${label}: ${subsectionLabel}`,
        value: label,
      };
    }),
  ];

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

  handleAssignmentFilterChange = (assignment) => {
    const selectedFilterOption = this.props.assignmentFilterOptions.find(assig =>
      assig.label === assignment);
    const { type, id } = selectedFilterOption || {};
    const typedValue = { label: assignment, type, id };
    this.props.updateAssignmentFilter(typedValue);
    const updatedQueryStrings = this.updateQueryParams('assignment', assignment);
    this.props.history.push(updatedQueryStrings);
  }

  updateQueryParams = (queryKey, queryValue) => {
    const parsed = queryString.parse(this.props.location.search);
    if (queryValue) {
      parsed[queryKey] = queryValue;
    } else {
      delete parsed[queryKey];
    }
    return `?${queryString.stringify(parsed)}`;
  };

  mapAssignmentTypeEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry,
      label: entry,
    }));
    mapped.unshift({ id: 0, label: 'All', value: '' });
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

  formatHistoryRow = (row) => {
    const {
      summaryOfRowsProcessed: {
        total,
        successfullyProcessed,
        failed,
        skipped,
      },
      unique_id: courseId,
      originalFilename,
      id,
      ...rest
    } = row;
    const resultsText = [
      `${total} Students: ${successfullyProcessed} processed`,
      ...(skipped > 0 ? [`${skipped} skipped`] : []),
      ...(failed > 0 ? [`${failed} failed`] : []),
    ].join(', ');
    const resultsSummary = (
      <a
        href={`${configuration.LMS_BASE_URL}/api/bulk_grades/course/${courseId}/?error_id=${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faDownload} />
        {resultsText}
      </a>
    );
    const filename = (
      <span className="original-filename">
        {originalFilename}
      </span>
    );
    return { resultsSummary, filename, ...rest };
  };

  updateAssignmentTypes = (assignmentType) => {
    this.props.filterAssignmentType(assignmentType);
    const updatedQueryStrings = this.updateQueryParams('assignmentType', assignmentType);
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
    const updatedQueryStrings = this.updateQueryParams('cohort', selectedCohortId);
    this.props.history.push(updatedQueryStrings);
  };

  handleClickExportGrades = () => {
    window.location = this.props.gradeExportUrl;
  };

  handleClickDownloadInterventions = () => {
    window.location = this.props.interventionExportUrl;
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
            <Tabs labels={this.getActiveTabs()}>
              <div>
                <h4>Step 1: Filter the Grade Report</h4>
                <div className="d-flex justify-content-between" >
                  {this.props.showSpinner && <div className="spinner-overlay"><Icon className={['fa', 'fa-spinner', 'fa-spin', 'fa-5x', 'color-black']} /></div>}
                  <div>
                    <InputSelect
                      label="Score View:"
                      name="ScoreView"
                      value="percent"
                      options={[{ label: 'Percent', value: 'percent' }, { label: 'Absolute', value: 'absolute' }]}
                      onChange={this.props.toggleFormat}
                    />
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
                        disabled={this.props.assignmentFilterOptions.length === 0}
                      />
                    </div>
                    <div className="student-filters">
                      <span className="label">
                        Assignment:
                      </span>
                      <InputSelect
                        name="assignment"
                        ariaLabel="Assignment"
                        value={this.props.selectedAssignment}
                        options={this.getAssignmentFilterOptions()}
                        onChange={this.handleAssignmentFilterChange}
                        disabled={this.props.assignmentFilterOptions.length === 0}
                      />
                    </div>
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

                <StatusAlert
                  alertType="success"
                  dialog="The grade has been successfully edited."
                  onClose={() => this.props.closeBanner()}
                  open={this.props.showSuccess}
                />
                <h4>Step 2: View or Modify Individual Grades</h4>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {this.props.totalUsersCount ?
                    <div>
                      Showing
                      <span className="font-weight-bold"> {this.props.filteredUsersCount} </span>
                      of
                      <span className="font-weight-bold"> {this.props.totalUsersCount} </span>
                      total learners
                    </div> :
                    null
                  }
                  {this.props.showDownloadButtons && <StatefulButton
                    buttonType="primary"
                    onClick={this.handleClickExportGrades}
                    state={this.props.showSpinner ? 'pending' : 'default'}
                    labels={{
                      default: 'Download Gradebook',
                      pending: 'Download Gradebook',
                    }}
                    icons={{
                      default: <FontAwesomeIcon icon={faDownload} />,
                      pending: <FontAwesomeIcon className="fa-spin" icon={faSpinner} />,
                    }}
                    disabledStates={['pending']}
                  />}
                </div>
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
                        <div className="grade-history-header grade-history-original-grade">Original Grade: </div> <div>{this.props.gradeOriginalEarnedGraded}</div>
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

                      <div>Showing most recent actions (max 5). To see more, please contact
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
                  <h4>Use this feature by downloading a CSV for bulk management,
                    overriding grades locally, and coming back here to upload.
                  </h4>
                  <form ref={this.fileFormRef} action={this.props.gradeExportUrl} method="post">
                    <StatusAlert
                      alertType="danger"
                      dialog={this.props.bulkImportError}
                      open={this.props.bulkImportError}
                      dismissible={false}
                    />
                    <StatusAlert
                      alertType="success"
                      dialog="CSV successfully uploaded. Refresh the page to review results."
                      open={this.props.uploadSuccess}
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
                    label="Import Grades"
                    buttonType="primary"
                    onClick={this.handleClickImportGrades}
                  />
                  <h4>Interventions Report</h4>
                  <Button
                    label="Download Interventions report"
                    buttonType="primary"
                    onClick={this.handleClickDownloadInterventions}
                  />
                  <br />
                  <p>
                    Results appear in the table below.<br />
                    Grade processing may take a few seconds.
                  </p>
                  <div>
                    Showing
                    <span className="font-weight-bold"> {this.props.filteredUsersCount} </span>
                    of
                    <span className="font-weight-bold"> {this.props.totalUsersCount} </span>
                    total learners
                  </div>
                  <Table
                    data={this.props.bulkManagementHistory.map(this.formatHistoryRow)}
                    hasFixedColumnWidths
                    columns={[
                      {
                        key: 'filename',
                        label: 'Gradebook',
                        columnSortable: false,
                        width: 'col-5',
                      },
                      {
                        key: 'resultsSummary',
                        label: 'Download Summary',
                        columnSortable: false,
                        width: 'col',
                      },
                      {
                        key: 'user',
                        label: 'Who',
                        columnSortable: false,
                        width: 'col-1',
                      },
                      {
                        key: 'timeUploaded',
                        label: 'When',
                        columnSortable: false,
                        width: 'col',
                      },
                    ]}
                    className="table-striped"
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
  assignmentFilterOptions: [],
  canUserViewGradebook: false,
  cohorts: [],
  grades: [],
  gradeOverrides: [],
  gradeOverrideCurrentEarnedGradedOverride: null,
  gradeOriginalEarnedGraded: null,
  location: {
    search: '',
  },
  courseId: '',
  selectedCohort: null,
  selectedTrack: null,
  selectedAssignmentType: '',
  selectedAssignment: '',
  showSpinner: false,
  tracks: [],
  bulkImportError: '',
  uploadSuccess: false,
  showBulkManagement: false,
  bulkManagementHistory: [],
  errorFetchingGradeOverrideHistory: false,
  totalUsersCount: null,
  filteredUsersCount: null,
  showDownloadButtons: false,
};

Gradebook.propTypes = {
  areGradesFrozen: PropTypes.bool,
  assignmentTypes: PropTypes.arrayOf(PropTypes.string),
  assignmentFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    subsectionLabel: PropTypes.string,
  })),
  canUserViewGradebook: PropTypes.bool,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  filterAssignmentType: PropTypes.func.isRequired,
  updateAssignmentFilter: PropTypes.func.isRequired,
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
  gradeOriginalEarnedGraded: PropTypes.number,
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
  selectedAssignment: PropTypes.string,
  selectedCohort: PropTypes.number,
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
  interventionExportUrl: PropTypes.string.isRequired,
  submitFileUploadFormData: PropTypes.func.isRequired,
  bulkImportError: PropTypes.string,
  uploadSuccess: PropTypes.bool,
  errorFetchingGradeOverrideHistory: PropTypes.bool,
  showBulkManagement: PropTypes.bool,
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    originalFilename: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    timeUploaded: PropTypes.string.isRequired,
    summaryOfRowsProcessed: PropTypes.shape({
      total: PropTypes.number.isRequired,
      successfullyProcessed: PropTypes.number.isRequired,
      failed: PropTypes.number.isRequired,
      skipped: PropTypes.number.isRequired,
    }).isRequired,
  })),
  totalUsersCount: PropTypes.number,
  filteredUsersCount: PropTypes.number,
  showDownloadButtons: PropTypes.bool,
  initializeFilters: PropTypes.func.isRequired,
};
