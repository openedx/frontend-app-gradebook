/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  InputSelect,
  Tab,
  Tabs,
} from '@edx/paragon';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import PageButtons from '../PageButtons';
import Drawer from '../Drawer';
import initialFilters from '../../data/constants/filters';
import ConnectedFilterBadges from '../FilterBadges';

import GradebookHeader from './GradebookHeader';
import BulkManagement from './BulkManagement';
import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import GradebookFilters from './GradebookFilters';
import GradebookTable from './GradebookTable';
import SearchControls from './SearchControls';
import StatusAlerts from './StatusAlerts';

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

  getActiveTabs = () => (
    this.props.showBulkManagement ? ['Grades', 'BulkManagement'] : ['Grades']
  );

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
    'assignmentName',
    'filterValue',
    'modalOpen',
    'reasonForChange',
    'todaysDate',
    'updateModuleId',
    'updateUserId',
    'updateUserName',
  );

  setFilters = this.createLimitedSetter(
    'assignmentGradeMin',
    'assignmentGradeMax',
    'courseGradeMin',
    'courseGradeMax',
    'isMinCourseGradeFilterValid',
    'isMaxCourseGradeFilterValid',
  );

  filterValues = () => ({
    assignmentGradeMin: this.state.assignmentGradeMin,
    assignmentGradeMax: this.state.assignmentGradeMax,
    courseGradeMin: this.state.courseGradeMin,
    courseGradeMax: this.state.courseGradeMax,
  });

  usersLabel = () => {
    if (!this.props.totalUsersCount) {
      return null;
    }
    const bold = (val) => (<span className="font-weight-bold">{val}</span>);
    const { filteredUsersCount, totalUsersCount } = this.props;
    return (
      <>
        Showing {bold(filteredUsersCount)} of {bold(totalUsersCount)} total learners
      </>
    );
  };

  scoreViewInput = () => (
    <InputSelect
      label="Score View:"
      name="ScoreView"
      value="percent"
      options={[{ label: 'Percent', value: 'percent' }, { label: 'Absolute', value: 'absolute' }]}
      onChange={this.props.toggleFormat}
    />
  );

  spinnerIcon = () => {
    if (!this.props.showSpinner) {
      return null;
    }
    return (
      <div className="spinner-overlay">
        <Icon className="fa fa-spinner fa-spin fa-5x color-black" />
      </div>
    );
  }

  render() {
    return (
      <Drawer
        mainContent={toggleFilterDrawer => (
          <div className="px-3 gradebook-content">
            <GradebookHeader courseId={this.props.courseId} />
            <Tabs defaultActiveKey="grades">
              <Tab eventKey="grades" title="Grades">
                {this.spinnerIcon()}
                <SearchControls
                  courseId={this.props.courseId}
                  filterValue={this.state.filterValue}
                  setFilterValue={this.createStateFieldSetter('filterValue')}
                  toggleFilterDrawer={toggleFilterDrawer}
                />
                <ConnectedFilterBadges
                  handleFilterBadgeClose={this.handleFilterBadgeClose}
                />
                <StatusAlerts
                  isMinCourseGradeFilterValid={this.state.isMinCourseGradeFilterValid}
                  isMaxCourseGradeFilterValid={this.state.isMaxCourseGradeFilterValid}
                />
                <h4>Step 2: View or Modify Individual Grades</h4>
                {this.usersLabel()}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {this.scoreViewInput()}
                  <BulkManagementControls courseId={this.props.courseId} />
                </div>
                <GradebookTable setGradebookState={this.safeSetState} />
                <PageButtons {...this.props} />
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
                <Tab eventKey="bulk_management" title="Bulk Management">
                  <BulkManagement courseId={this.props.courseId} />
                </Tab>
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
        <GradebookFilters
          setFilters={this.setFilters}
          filterValues={this.filterValues()}
          updateQueryParams={this.updateQueryParams}
          courseId={this.props.courseId}
        />
      </Drawer>
    );
  }
}

Gradebook.defaultProps = {
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
};

Gradebook.propTypes = {
  courseId: PropTypes.string,
  filteredUsersCount: PropTypes.number,
  getRoles: PropTypes.func.isRequired,
  getUserGrades: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  initializeFilters: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  resetFilters: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  showBulkManagement: PropTypes.bool,
  showSpinner: PropTypes.bool,
  toggleFormat: PropTypes.func.isRequired,
  totalUsersCount: PropTypes.number,
};
