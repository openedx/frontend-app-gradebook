import React from 'react';
import { Button, Modal, SearchField, Table, InputSelect } from '@edx/paragon';
import queryString from 'query-string';
import { configuration } from '../../config';

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades: [], // this.mapUserEntriesPercent(this.props.grades).sort(this.sortAlphaDesc),
      headings: [], // this.mapHeadings(this.props.grades[0]),
      filterValue: '',
      modalContent: (<h1>Hello, World!</h1>),
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
  }

  setNewModalState = (userEntry, subsection) => {
    this.setState({
      modalModel: [{
        username: userEntry.username,
        currentGrade: `${subsection.score_earned}/${subsection.score_possible}`,
        adjustedGrade: (
          <span>
            <input
              style={{ width: '25px' }}
              type="text"
              onChange={event => this.setState({ updateVal: event.target.value })}
            /> / {subsection.score_possible}
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
    this.props.updateGrades(this.props.match.params.courseId, [
      {
        user_id: this.state.updateUserId,
        usage_id: this.state.updateModuleId,
        grade: {
          earned_graded_override: this.state.updateVal,
        },
      },
    ]);
  }
  updateQueryParams = (queryKey, queryValue) => {
    const parsed = queryString.parse(this.props.location.search);
    parsed[queryKey] = queryValue;
    return `?${queryString.stringify(parsed)}`;
  };

  mapCohortsEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry.id,
      label: entry.name,
    }));
    mapped.unshift({ id: 0, label: 'Cohorts' });
    return mapped;
  };

  mapTracksEntries = (entries) => {
    const mapped = entries.map(entry => ({
      id: entry.slug,
      label: entry.name,
    }));
    mapped.unshift({ label: 'Tracks' });
    return mapped;
  };

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

  formatter = {
    percent: entries => entries.map((entry) => {
      const results = { username: entry.username };
      const assignments = entry.section_breakdown
        .filter(section => section.is_graded)
        .reduce((acc, subsection) => {
          acc[subsection.label] = (
            <button
              className="btn btn-header link-style"
              onClick={() => this.setNewModalState(entry, subsection)}
            >
              {subsection.percent}
            </button>);
          return acc;
        }, {});
      const totals = { total: entry.percent * 100 };
      return Object.assign(results, assignments, totals);
    }),

    absolute: entries => entries.map((entry) => {
      const results = { username: entry.username };
      const assignments = entry.section_breakdown
        .filter(section => section.is_graded)
        .reduce((acc, subsection) => {
          acc[subsection.label] = (
            <button
              className="btn btn-header link-style"
              onClick={() => this.setNewModalState(entry, subsection)}
            >
              {subsection.score_earned}/{subsection.score_possible}
            </button>);
          return acc;
        }, {});

      const totals = { total: entry.percent * 100 };
      return Object.assign(results, assignments, totals);
    }),
  };

  lmsInstructorDashboardUrl = courseId => `${configuration.LMS_BASE_URL}/courses/${courseId}/instructor`;

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: '50rem' }}>
          <div className="card-body">
            <a
              href={this.lmsInstructorDashboardUrl(this.props.match.params.courseId)}
              className="back-link"
            >
              Back to Dashboard
            </a>
            <h1>Gradebook</h1>
            <h3> {this.props.match.params.courseId}</h3>
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
                <div>
                  Category:
                  <span>
                    <input
                      id="category-all"
                      className="ml-2 mr-1"
                      type="radio"
                      name="category"
                      value="all"
                      onClick={() => this.props.filterColumns('all', this.props.grades[0])}
                    />
                    <label className="mr-2" htmlFor="category-all">
                      All
                    </label>
                  </span>
                  <span>
                    <input
                      id="category-homework"
                      className="mr-1"
                      type="radio"
                      name="category"
                      value="homework"
                      onClick={() => this.props.filterColumns('hw', this.props.grades[0])}
                    />
                    <label className="mr-2" htmlFor="category-homework">Homework</label>
                  </span>
                  <span>
                    <input
                      id="category-exam"
                      type="radio"
                      name="category"
                      value="exam"
                      className="ml-2 mr-1"
                      onClick={() => this.props.filterColumns('exam', this.props.grades[0])}
                    />
                    <label htmlFor="Exam">
                      Exam
                    </label>
                  </span>
                </div>
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
                  <a href={`${this.lmsInstructorDashboardUrl(this.props.match.params.courseId)}#view-data_download`}>Download Grade Report</a>
                </div>
                <SearchField
                  onSubmit={value => this.props.searchForUser(this.props.match.params.courseId, value, this.props.selectedCohort, this.props.selectedTrack)}
                  onChange={filterValue => this.setState({ filterValue })}
                  onClear={() => this.props.getUserGrades(this.props.match.params.courseId, this.props.selectedCohort, this.props.selectedTrack)}
                  value={this.state.filterValue}
                />
              </div>
            </div>
            <br />
            <div className="gbook">
              <Table
                columns={this.props.headings}
                data={this.formatter[this.props.format](this.props.grades)}
                defaultSortDirection="desc"
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
                    tableSortable
                    defaultSortDirection="desc"
                    defaultSortedColumn="username"
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

