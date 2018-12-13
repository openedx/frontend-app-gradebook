import React from 'react';
import {
  Button,
  InputSelect,
  Modal,
  SearchField,
  StatusAlert,
  Table,
  Icon,
} from '@edx/paragon';
import queryString from 'query-string';
import { configuration } from '../../config';

const DECIMAL_PRECISION = 2;

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: '',
      modalOpen: false,
      modalModel: [{}],
      updateVal: 0,
      updateModuleId: null,
      updateUserId: null,
    };
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.getUserGrades(
      this.props.match.params.courseId,
      urlQuery.cohort,
      urlQuery.track,
    );
    this.props.getTracks(this.props.match.params.courseId);
    this.props.getCohorts(this.props.match.params.courseId);
    this.props.getAssignmentTypes(this.props.match.params.courseId);
  }

  setNewModalState = (userEntry, subsection) => {
    let adjustedGradePossible = '';
    let currentGradePossible = '';
    if (subsection.attempted) {
      adjustedGradePossible = ` / ${subsection.score_possible}`;
      currentGradePossible = `/${subsection.score_possible}`;
    }
    this.setState({
      modalModel: [{
        username: userEntry.username,
        currentGrade: `${subsection.score_earned}${currentGradePossible}`,
        adjustedGrade: (
          <span>
            <input
              style={{ width: '25px' }}
              type="text"
              onChange={event => this.setState({ updateVal: event.target.value })}
            />{adjustedGradePossible}
          </span>
        ),
        assignmentName: `${subsection.subsection_name}`,
      }],
      modalOpen: true,
      updateModuleId: subsection.module_id,
      updateUserId: userEntry.user_id,
    });
  }

  handleAdjustedGradeClick = () => {
    this.props.updateGrades(
      this.props.match.params.courseId, [
        {
          user_id: this.state.updateUserId,
          usage_id: this.state.updateModuleId,
          grade: {
            earned_graded_override: this.state.updateVal,
          },
        },
      ],
      this.state.filterValue,
      this.props.selectedCohort,
      this.props.selectedTrack,
    );

    this.setState({
      modalModel: [{}],
      modalOpen: false,
      updateModuleId: null,
      updateUserId: null,
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
  }

  updateTracks = (event) => {
    const selectedTrackItem = this.props.tracks.find(x => x.name === event);
    let selectedTrackSlug = null;
    if (selectedTrackItem) {
      selectedTrackSlug = selectedTrackItem.slug;
    }
    this.props.getUserGrades(
      this.props.match.params.courseId,
      this.props.selectedCohort,
      selectedTrackSlug,
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
      this.props.match.params.courseId,
      selectedCohortId,
      this.props.selectedTrack,
    );
    const updatedQueryStrings = this.updateQueryParams('cohort', selectedCohortId);
    this.props.history.push(updatedQueryStrings);
  };

  mapSelectedAssignmentTypeEntry = (entry) => {
    const selectedAssignmentTypeEntry = this.props.assignmentTypes
      .find(x => x.id === parseInt(entry, 10));
    if (selectedAssignmentTypeEntry) {
      return selectedAssignmentTypeEntry.name;
    }
    return 'All';
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

  roundGrade = percent => parseFloat(percent.toFixed(DECIMAL_PRECISION));

  formatter = {
    percent: (entries, areGradesFrozen) => entries.map((entry) => {
      const results = { username: entry.username };
      const assignments = entry.section_breakdown
        .filter(section => section.is_graded)
        .reduce((acc, subsection) => {
          if (areGradesFrozen) {
            acc[subsection.label] = `${this.roundGrade(subsection.percent * 100)} %`;
          } else {
            acc[subsection.label] = (
              <button
                className="btn btn-header link-style"
                onClick={() => this.setNewModalState(entry, subsection)}
              >
                {this.roundGrade(subsection.percent * 100)}%
              </button>);
          }
          return acc;
        }, {});
      const totals = { total: `${this.roundGrade(entry.percent * 100)}%` };
      return Object.assign(results, assignments, totals);
    }),

    absolute: (entries, areGradesFrozen) => entries.map((entry) => {
      const results = { username: entry.username };
      const assignments = entry.section_breakdown
        .filter(section => section.is_graded)
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

      const totals = { total: `${this.roundGrade(entry.percent * 100)}/100` };
      return Object.assign(results, assignments, totals);
    }),
  };

  lmsInstructorDashboardUrl = courseId => `${configuration.LMS_BASE_URL}/courses/${courseId}/instructor`;

  render() {
    return (
      <div className="d-flex justify-content-center">
        { this.props.showSpinner && <div className="spinner-overlay"><Icon className={['fa', 'fa-spinner', 'fa-spin', 'fa-5x', 'color-black']} /></div>}
        <div className="gradebook-container">
          <div>
            <a
              href={this.lmsInstructorDashboardUrl(this.props.match.params.courseId)}
              className="mb-3"
            >
              {'<< Back to Dashboard'}
            </a>
            <h1>Gradebook</h1>
            <h3> {this.props.match.params.courseId}</h3>
            { this.props.areGradesFrozen &&
              <div className="alert alert-warning" role="alert" >
                The grades for this course are now frozen. Editing of grades is no longer allowed.
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between" >
              <div>
                <div>
                  Score View:
                  <span>
                    <input
                      id="score-view-percent"
                      className="ml-2 mr-1"
                      type="radio"
                      name="score-view"
                      value="percent"
                      onClick={() => this.props.toggleFormat('percent')}
                    />
                    <label className="mr-2" htmlFor="score-view-percent">Percent</label>
                  </span>
                  <span>
                    <input
                      id="score-view-absolute"
                      type="radio"
                      name="score-view"
                      value="absolute"
                      className="mr-1"
                      onClick={() => this.props.toggleFormat('absolute')}
                    />
                    <label htmlFor="score-view-absolute">Absolute</label>
                  </span>
                </div>
                { this.props.assignmnetTypes.length > 0 &&
                  <div className="student-filters">
                    <span className="label">
                      Assignment Types:
                    </span>
                    <InputSelect
                      name="assignment-types"
                      value={this.mapSelectedTrackEntry(this.props.selectedAssignmentType)}
                      options={this.mapAssignmentTypeEntries(this.props.assignmnetTypes)}
                      onChange={this.updateAssignmentTypes}
                    />
                  </div>
                }
                {(this.props.tracks.length > 0 || this.props.cohorts.length > 0) &&
                  <div className="student-filters">
                    <span className="label">
                      Student Groups:
                    </span>
                    {this.props.tracks.length > 0 &&
                      <InputSelect
                        name="Tracks"
                        value={this.mapSelectedTrackEntry(this.props.selectedTrack)}
                        options={this.mapTracksEntries(this.props.tracks)}
                        onChange={this.updateTracks}
                      />
                    }
                    {this.props.cohorts.length > 0 &&
                      <InputSelect
                        name="Cohorts"
                        value={this.mapSelectedCohortEntry(this.props.selectedCohort)}
                        options={this.mapCohortsEntries(this.props.cohorts)}
                        onChange={this.updateCohorts}
                      />
                    }
                  </div>
                }
              </div>
              <div>
                <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
                  <a href={`${this.lmsInstructorDashboardUrl(this.props.match.params.courseId)}#view-data_download`}>Generate Grade Report</a>
                </div>
                <SearchField
                  onSubmit={value => this.props.searchForUser(this.props.match.params.courseId, value, this.props.selectedCohort, this.props.selectedTrack)}
                  onChange={filterValue => this.setState({ filterValue })}
                  onClear={() => this.props.getUserGrades(this.props.match.params.courseId, this.props.selectedCohort, this.props.selectedTrack)}
                  value={this.state.filterValue}
                />
                <div className="d-flex justify-content-end" style={{ marginTop: '20px' }}>
                  <Button
                    label="Previous"
                    buttonType="primary"
                    style={{ visibility: (!this.props.prevPage ? 'hidden' : 'visible') }}
                    onClick={() => this.props.getPrevNextGrades(this.props.prevPage, this.props.selectedCohort, this.props.selectedTrack)}
                  />
                  <div style={{ width: '10px' }} />
                  <Button
                    label="Next"
                    buttonType="primary"
                    style={{ visibility: (!this.props.nextPage ? 'hidden' : 'visible') }}
                    onClick={() => this.props.getPrevNextGrades(this.props.nextPage, this.props.selectedCohort, this.props.selectedTrack)}
                  />
                </div>
              </div>
            </div>
            <br />
            <StatusAlert
              alertType="success"
              dialog="The grade has been successfully edited."
              onClose={() => this.props.updateBanner(false)}
              open={this.props.showSuccess}
            />
            <div className="gbook">
              <Table
                columns={this.props.headings}
                data={this.formatter[this.props.format](this.props.grades, this.props.areGradesFrozen)}
                tableSortable
                defaultSortDirection="asc"
                defaultSortedColumn="username"
              />
            </div>
            <Modal
              open={this.state.modalOpen}
              title="Edit Grades"
              body={(
                <div>
                  <h3>{this.state.modalModel[0].assignmentName}</h3>
                  <Table
                    columns={[{ label: 'Username', key: 'username' }, { label: 'Current grade', key: 'currentGrade' }, { label: 'Adjusted grade', key: 'adjustedGrade' }]}
                    data={this.state.modalModel}
                  />
                </div>
              )}
              buttons={[
                <Button
                  label="Edit Grade"
                  buttonType="primary"
                  onClick={this.handleAdjustedGradeClick}
                />,
              ]}
              onClose={() => this.setState({
                modalOpen: false,
                modalModel: [{}],
                updateVal: 0,
                updateModuleId: null,
                updateUserId: null,
              })}
            />
          </div>
        </div>
      </div>
    );
  }
}

