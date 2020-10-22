/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Collapsible,
  Icon,
  InputSelect,
  InputText,
  SearchField,
  StatusAlert,
  Tab,
  Tabs,
} from '@edx/paragon';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { configuration } from '../../config';
import PageButtons from '../PageButtons';
import Drawer from '../Drawer';
import initialFilters from '../../data/constants/filters';
import ConnectedFilterBadges from '../FilterBadges';

import Assignments from './Assignments';
import BulkManagement from './BulkManagement';
import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import GradebookTable from './GradebookTable';

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adjustedGradePossible: '',
      adjustedGradeValue: 0,
      assignmentGradeMin: '0',
      assignmentGradeMax: '100',
      assignmentName: '',
      courseGradeMin: '0',
      courseGradeMax: '100',
      filterValue: '',
      isMinCourseGradeFilterValid: true,
      isMaxCourseGradeFilterValid: true,
      modalOpen: false,
      reasonForChange: '',
      todaysDate: '',
      updateModuleId: null,
      updateUserId: null,
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.initializeFilters(urlQuery);
    this.props.getRoles(this.props.courseId);

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

  getActiveTabs = () => {
    if (this.props.showBulkManagement) {
      return ['Grades', 'Bulk Management'];
    }
    return ['Grades'];
  };

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

  lmsInstructorDashboardUrl = courseId => `${configuration.LMS_BASE_URL}/courses/${courseId}/instructor`;

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
        this.props.courseId,
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
    }
  }

  isGradeFilterValueInRange = (value) => {
    const valueAsInt = parseInt(value, 10);
    return valueAsInt >= 0 && valueAsInt <= 100;
  };

  handleFilterBadgeClose = filterNames => () => {
    this.props.resetFilters(filterNames);
    const queryParams = {};
    filterNames.forEach((filterName) => {
      queryParams[filterName] = false;
    });
    this.updateQueryParams(queryParams);
    const stateUpdate = {};
    const rangeStateFilters = ['assignmentGradeMin', 'assignmentGradeMax', 'courseGradeMin', 'courseGradeMax'];
    rangeStateFilters.forEach((filterName) => {
      if (filterNames.includes(filterName)) {
        stateUpdate[filterName] = initialFilters[filterName];
      }
    });
    this.setState(stateUpdate);
    this.props.getUserGrades(
      this.props.courseId,
      filterNames.includes('cohort') ? initialFilters.cohort : this.props.selectedCohort,
      filterNames.includes('track') ? initialFilters.track : this.props.selectedTrack,
      filterNames.includes('assignmentType') ? initialFilters.assignmentType : this.props.selectedAssignmentType,
    );
  }

  createStateFieldSetter = (key) => (value) => this.setState({ [key]: value });

  createStateFieldOnChange = (key) => ({ target }) => this.setState({ [key]: target.value });

  createLimitedSetter = (...keys) => (values) => this.setState(
    keys.reduce(
      (obj, key) => (values[key] === undefined ? obj : { ...obj, [key]: values[key] }),
      {},
    ),
  )

  safeSetState = this.createLimitedSetter(
    'adjustedGradePossible',
    'adjustedGradeValue',
    'assignmnentName',
    'modalOpen',
    'reasonForChange',
    'todaysDate',
    'updateModuleId',
    'updateUserId',
    'updateUserName',
  );

  render() {
    return (
      <Drawer
        mainContent={toggleFilterDrawer => (
          <div className="px-3 gradebook-content">
            <a
              href={this.lmsInstructorDashboardUrl(this.props.courseId)}
              className="mb-3"
            >
              <span aria-hidden="true">{'<< '}</span> Back to Dashboard
            </a>
            <h1>Gradebook</h1>
            <h3> {this.props.courseId}</h3>
            {this.props.areGradesFrozen
              && (
              <div className="alert alert-warning" role="alert">
                The grades for this course are now frozen. Editing of grades is no longer allowed.
              </div>
              )}
            {(this.props.canUserViewGradebook === false)
              && (
              <div className="alert alert-warning" role="alert">
                You are not authorized to view the gradebook for this course.
              </div>
              )}
            <Tabs defaultActiveKey="grades">
              <Tab eventKey="grades" title="Grades">
                <h4>Step 1: Filter the Grade Report</h4>
                <div className="d-flex justify-content-between">
                  {this.props.showSpinner && <div className="spinner-overlay"><Icon className="fa fa-spinner fa-spin fa-5x color-black" /></div>}
                  <Button className="btn-primary align-self-start" onClick={toggleFilterDrawer}><FontAwesomeIcon icon={faFilter} /> Edit Filters</Button>
                  <div>
                    <SearchField
                      onSubmit={value => this.props.searchForUser(
                        this.props.courseId,
                        value,
                        this.props.selectedCohort,
                        this.props.selectedTrack,
                        this.props.selectedAssignmentType,
                      )}
                      inputLabel="Search for a learner"
                      onChange={filterValue => this.setState({ filterValue })}
                      onClear={() => this.props.getUserGrades(
                        this.props.courseId,
                        this.props.selectedCohort,
                        this.props.selectedTrack,
                        this.props.selectedAssignmentType,
                      )}
                      value={this.state.filterValue}
                    />
                    <small className="form-text text-muted search-help-text">Search by username, email, or student key</small>
                  </div>
                </div>
                <ConnectedFilterBadges
                  handleFilterBadgeClose={this.handleFilterBadgeClose}
                />
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
                    !this.state.isMinCourseGradeFilterValid
                    || !this.state.isMaxCourseGradeFilterValid
                  }
                />
                <h4>Step 2: View or Modify Individual Grades</h4>
                {this.props.totalUsersCount
                  ? (
                    <div>
                      Showing
                      <span className="font-weight-bold"> {this.props.filteredUsersCount} </span>
                      of
                      <span className="font-weight-bold"> {this.props.totalUsersCount} </span>
                      total learners
                    </div>
                  )
                  : null}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <InputSelect
                    label="Score View:"
                    name="ScoreView"
                    value="percent"
                    options={[{ label: 'Percent', value: 'percent' }, { label: 'Absolute', value: 'absolute' }]}
                    onChange={this.props.toggleFormat}
                  />
                  {this.props.showBulkManagement && (
                    <BulkManagementControls
                      courseId={this.props.courseId}
                      gradeExportUrl={this.props.gradeExportUrl}
                      interventionExportUrl={this.props.interventionExportUrl}
                      showSpinner={this.props.showSpinner}
                    />
                  )}
                </div>
                <GradebookTable setGradebookState={this.safeSetState} />
                {PageButtons(this.props)}
                <p>* available for learners in the Master&apos;s track only</p>
                <EditModal
                  assignmentName={this.state.assignmentName}
                  adjustedGradeValue={this.state.adjustedGradeValue}
                  adjustedGradePossible={this.state.adjustedGradePossible}
                  courseId={this.props.courseId}
                  filterValue={this.state.filterValue}
                  onChange={this.onChange}
                  open={this.state.modalOpen}
                  reasonForChange={this.state.reasonForChange}
                  setAdjustedGradeValue={this.createStateFieldOnChange('adjustedGradeValue')}
                  setGradebookState={this.safeSetState}
                  setReasonForChange={this.createStateFieldOnChange('reasonForChange')}
                  todaysDate={this.state.todaysDate}
                  updateModuleId={this.state.updateModuleId}
                  updateUserId={this.state.updateUserId}
                  updateUserName={this.state.updateUserName}
                />

              </Tab>
              {this.props.showBulkManagement
                && (
                <BulkManagement
                  courseId={this.props.courseId}
                  gradeExportUrl={this.props.gradeExportUrl}
                />
                )}
            </Tabs>
          </div>
        )}
        initiallyOpen={false}
        title={(
          <>
            <FontAwesomeIcon icon={faFilter} /> Filter By...
          </>
        )}
      >
        <Assignments
          assignmentGradeMin={this.state.assignmentGradeMin}
          assignmentGradeMax={this.state.assignmentGradeMax}
          courseId={this.props.courseId}
          setAssignmentGradeMin={this.createStateFieldSetter('assignmentGradeMin')}
          setAssignmentGradeMax={this.createStateFieldSetter('assignmentGradeMax')}
          updateQueryParams={this.updateQueryParams}
        />
        <Collapsible title="Overall Grade" open className="filter-group mb-3">
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
              variant="outline-secondary"
              onClick={this.handleCourseGradeFilterApplyButtonClick}
            >
              Apply
            </Button>
          </div>
        </Collapsible>
        <Collapsible title="Student Groups" open className="filter-group mb-3">
          <InputSelect
            label="Tracks"
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
            label="Cohorts"
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
  canUserViewGradebook: false,
  cohorts: [],
  courseId: '',
  filteredUsersCount: null,
  location: {
    search: '',
  },
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
  showBulkManagement: false,
  showSpinner: false,
  totalUsersCount: null,
  tracks: [],
};

Gradebook.propTypes = {
  areGradesFrozen: PropTypes.bool,
  canUserViewGradebook: PropTypes.bool,
  closeBanner: PropTypes.func.isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  courseId: PropTypes.string,
  filteredUsersCount: PropTypes.number,
  getRoles: PropTypes.func.isRequired,
  getUserGrades: PropTypes.func.isRequired,
  gradeExportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  initializeFilters: PropTypes.func.isRequired,
  interventionExportUrl: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  resetFilters: PropTypes.func.isRequired,
  searchForUser: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  showBulkManagement: PropTypes.bool,
  showSpinner: PropTypes.bool,
  showSuccess: PropTypes.bool.isRequired,
  toggleFormat: PropTypes.func.isRequired,
  totalUsersCount: PropTypes.number,
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  updateCourseGradeFilter: PropTypes.func.isRequired,
};
