import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Collapsible,
  Icon,
  InputSelect,
  InputText,
  Modal,
  SearchField,
  StatefulButton,
  StatusAlert,
  Table,
  Tabs,
} from '@edx/paragon';
import { trackEvent } from '@redux-beacon/segment';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner, faFilter } from '@fortawesome/free-solid-svg-icons';
import { configuration } from '../../config';
import PageButtons from '../PageButtons';
import Drawer from '../Drawer';
import { formatDateForDisplay } from '../../data/actions/utils';
import { trackingCategory } from '../../data/store';


const DECIMAL_PRECISION = 2;
const GRADE_OVERRIDE_HISTORY_COLUMNS = [{ label: 'Date', key: 'date' }, { label: 'Grader', key: 'grader' },
  { label: 'Reason', key: 'reason' },
  { label: 'Adjusted grade', key: 'adjustedGrade' }];

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: '',
      courseGradeMin: '0',
      courseGradeMax: '100',
      modalOpen: false,
      adjustedGradeValue: 0,
      updateModuleId: null,
      updateUserId: null,
      reasonForChange: '',
      assignmentGradeMin: '0',
      assignmentGradeMax: '100',
      isMinCourseGradeFilterValid: true,
      isMaxCourseGradeFilterValid: true,
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

    const newStateFields = {};
    ['assignmentGradeMin', 'assignmentGradeMax', 'courseGradeMin', 'courseGradeMax'].forEach((attr) => {
      if (urlQuery[attr]) {
        newStateFields[attr] = urlQuery[attr];
      }
    });

    this.setState(newStateFields);
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

  getCourseGradeFilterAlertDialog = () => {
    let dialog = '';

    if (!this.state.isMinCourseGradeFilterValid) {
      dialog += 'Minimum course grade value must be between 0 and 100. ';
    }
    if (!this.state.isMaxCourseGradeFilterValid) {
      dialog += 'Maximum course grade value must be between 0 and 100. ';
    }
    return dialog;
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

  handleAssignmentFilterChange = (assignment) => {
    const selectedFilterOption = this.props.assignmentFilterOptions.find(assig =>
      assig.label === assignment);
    const { type, id } = selectedFilterOption || {};
    const typedValue = { label: assignment, type, id };
    this.props.updateAssignmentFilter(typedValue);
    this.updateQueryParams({ assignment: id });
    this.props.updateGradesIfAssignmentGradeFiltersSet(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  };

  updateQueryParams = (queryParams) => {
    const parsed = queryString.parse(this.props.location.search);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        parsed[key] = queryParams[key];
      } else {
        delete parsed[key];
      }
    });
    this.props.history.push(`?${queryString.stringify(parsed)}`);
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
    this.updateQueryParams({ assignmentType });
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
    this.updateQueryParams({ track: selectedTrackSlug });
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
    this.updateQueryParams({ cohort: selectedCohortId });
  };

  handleClickExportGrades = () => {
    trackEvent(() => ({
      name: 'edx.gradebook.reports.grade_export',
      properties: {
        category: trackingCategory,
        courseId: this.props.courseId,
      },
    }));
    window.location = this.props.gradeExportUrl;
  };

  handleClickDownloadInterventions = () => {
    trackEvent(() => ({
      name: 'edx.gradebook.reports.intervention',
      properties: {
        category: trackingCategory,
        courseId: this.props.courseId,
      },
    }));
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

  handleSubmitAssignmentGrade = (event) => {
    event.preventDefault();
    const {
      assignmentGradeMin,
      assignmentGradeMax,
    } = this.state;

    this.props.updateAssignmentLimits(assignmentGradeMin, assignmentGradeMax);
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
    this.updateQueryParams({ assignmentGradeMin, assignmentGradeMax });
  };

  handleMinAssigGradeChange = assignmentGradeMin => this.setState({ assignmentGradeMin });

  handleMaxAssigGradeChange = assignmentGradeMax => this.setState({ assignmentGradeMax });

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

  handleCourseGradeFilterChange = (type, value) => {
    const filterValue = value;

    if (type === 'min') {
      this.setState({
        courseGradeMin: filterValue,
      });
    } else {
      this.setState({
        courseGradeMax: filterValue,
      });
    }
  }

  handleCourseGradeFilterApplyButtonClick = () => {
    const { courseGradeMin, courseGradeMax } = this.state;
    const isMinValid = this.isGradeFilterValueInRange(courseGradeMin);
    const isMaxValid = this.isGradeFilterValueInRange(courseGradeMax);

    this.setState({
      isMinCourseGradeFilterValid: isMinValid,
      isMaxCourseGradeFilterValid: isMaxValid,
    });

    if (isMinValid && isMaxValid) {
      this.props.updateCourseGradeFilter(
        courseGradeMin,
        courseGradeMax,
      );
      this.props.getUserGrades(
        this.props.courseId,
        this.props.selectedCohort,
        this.props.selectedTrack,
        this.props.selectedAssignmentType,
        {
          courseGradeMin,
          courseGradeMax,
        },
      );
      this.updateQueryParams({ courseGradeMin, courseGradeMax });
      trackEvent(() => ({
        name: 'edx.gradebook.grades.filter_applied',
        properties: {
          category: trackingCategory,
          courseId: this.props.courseId,
        },
      }));
    }
  }

  isGradeFilterValueInRange = (value) => {
    const valueAsInt = parseInt(value, 10);
    return valueAsInt >= 0 && valueAsInt <= 100;
  };


  render() {
    return (
      <Drawer
        mainContent={toggleFilterDrawer => (
          <div className="px-3 gradebook-content">
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
                  {this.props.showSpinner && <div className="spinner-overlay"><Icon className="fa fa-spinner fa-spin fa-5x color-black" /></div>}
                  <Button className="btn-primary align-self-start" onClick={toggleFilterDrawer}><FontAwesomeIcon icon={faFilter} /> Edit Filters</Button>
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
                  dialog="The grade has been successfully edited. You may see a slight delay before updates appear in the Gradebook."
                  onClose={() => this.props.closeBanner()}
                  open={this.props.showSuccess}
                />
                <StatusAlert
                  alertType="danger"
                  dialog={this.getCourseGradeFilterAlertDialog()}
                  dismissible={false}
                  open={
                    !this.state.isMinCourseGradeFilterValid ||
                    !this.state.isMaxCourseGradeFilterValid
                  }
                />
                <h4>Step 2: View or Modify Individual Grades</h4>
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
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <InputSelect
                    label="Score View:"
                    name="ScoreView"
                    value="percent"
                    options={[{ label: 'Percent', value: 'percent' }, { label: 'Absolute', value: 'absolute' }]}
                    onChange={this.props.toggleFormat}
                  />
                  {this.props.showBulkManagement && (
                    <div>
                      <StatefulButton
                        buttonType="outline-primary"
                        onClick={this.handleClickExportGrades}
                        state={this.props.showSpinner ? 'pending' : 'default'}
                        labels={{
                          default: 'Bulk Management',
                          pending: 'Bulk Management',
                        }}
                        icons={{
                          default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
                          pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
                        }}
                        disabledStates={['pending']}
                      />
                      <StatefulButton
                        buttonType="outline-primary"
                        onClick={this.handleClickDownloadInterventions}
                        state={this.props.showSpinner ? 'pending' : 'default'}
                        className="ml-2"
                        labels={{
                          default: 'Interventions',
                          pending: 'Interventions',
                        }}
                        icons={{
                          default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
                          pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
                        }}
                        disabledStates={['pending']}
                      />
                    </div>
                  )}
                </div>
                <div className="gradebook-container">
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
                      buttonType="primary"
                      onClick={this.handleAdjustedGradeClick}
                    >
                      Save Grade
                    </Button>,
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
                    buttonType="primary"
                    onClick={this.handleClickImportGrades}
                  >
                    Import Grades
                  </Button>
                  <p>
                    Results appear in the table below.<br />
                    Grade processing may take a few seconds.
                  </p>
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
        )}
        initiallyOpen={false}
        title={
          <React.Fragment>
            <FontAwesomeIcon icon={faFilter} /> Filter By...
          </React.Fragment>
        }
      >
        <Collapsible title="Assignments" isOpen className="filter-group">
          <div>
            <div className="student-filters">
              <span className="label">
                Assignment Types:
              </span>
              <InputSelect
                name="assignment-types"
                aria-label="Assignment Types"
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
                aria-label="Assignment"
                value={this.props.selectedAssignment}
                options={this.getAssignmentFilterOptions()}
                onChange={this.handleAssignmentFilterChange}
                disabled={this.props.assignmentFilterOptions.length === 0}
              />
            </div>
            <p>Grade Range (0% - 100%)</p>
            <form className="d-flex justify-content-between align-items-center" onSubmit={this.handleSubmitAssignmentGrade}>
              <InputText
                label="Min Grade"
                name="assignmentGradeMin"
                type="number"
                min={0}
                max={100}
                step={1}
                value={this.state.assignmentGradeMin}
                disabled={!this.props.selectedAssignment}
                onChange={this.handleMinAssigGradeChange}
              />
              <span className="input-percent-label">%</span>
              <InputText
                label="Max Grade"
                name="assignmentGradeMax"
                type="number"
                min={0}
                max={100}
                step={1}
                value={this.state.assignmentGradeMax}
                disabled={!this.props.selectedAssignment}
                onChange={this.handleMaxAssigGradeChange}
              />
              <span className="input-percent-label">%</span>
              <Button
                type="submit"
                className="btn-outline-secondary"
                name="assignmentGradeMinMax"
                disabled={!this.props.selectedAssignment}
              >
                Apply
              </Button>
            </form>
          </div>
        </Collapsible>
        <Collapsible title="Overall Grade" isOpen className="filter-group">
          <div className="d-flex justify-content-between align-items-center">
            <InputText
              value={this.state.courseGradeMin}
              name="minimum-grade"
              label="Min Grade"
              onChange={value => this.handleCourseGradeFilterChange('min', value)}
              type="number"
              min={0}
              max={100}
            />
            <span className="input-percent-label">%</span>
            <InputText
              value={this.state.courseGradeMax}
              name="max-grade"
              label="Max Grade"
              onChange={value => this.handleCourseGradeFilterChange('max', value)}
              type="number"
              min={0}
              max={100}
            />
            <span className="input-percent-label">%</span>
            <Button
              buttonType="outline-secondary"
              onClick={this.handleCourseGradeFilterApplyButtonClick}
            >
              Apply
            </Button>
          </div>
        </Collapsible>
        <Collapsible title="Student Groups" isOpen className="filter-group">
          <InputSelect
            name="Tracks"
            aria-label="Tracks"
            disabled={this.props.tracks.length === 0}
            value={this.mapSelectedTrackEntry(this.props.selectedTrack)}
            options={this.mapTracksEntries(this.props.tracks)}
            onChange={this.updateTracks}
          />
          <InputSelect
            name="Cohorts"
            aria-label="Cohorts"
            disabled={this.props.cohorts.length === 0}
            value={this.mapSelectedCohortEntry(this.props.selectedCohort)}
            options={this.mapCohortsEntries(this.props.cohorts)}
            onChange={this.updateCohorts}
          />
        </Collapsible>
      </Drawer>
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
  updateAssignmentLimits: PropTypes.func.isRequired,
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
  selectedCohort: PropTypes.string,
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
  initializeFilters: PropTypes.func.isRequired,
  updateGradesIfAssignmentGradeFiltersSet: PropTypes.func.isRequired,
  updateCourseGradeFilter: PropTypes.func.isRequired,
};
