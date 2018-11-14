import React from 'react';
import PropTypes from 'prop-types';
import emailPropType from 'email-prop-type';
import { Button, Modal, SearchField, Table, InputSelect } from '@edx/paragon';
import queryString from 'query-string';


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

  sortAlphaDesc = (gradeRowA, gradeRowB) => {
    const a = gradeRowA.username.toUpperCase();
    const b = gradeRowB.username.toUpperCase();
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  sortAlphaAsc = (gradeRowA, gradeRowB) => {
    const a = gradeRowA.username.toUpperCase();
    const b = gradeRowB.username.toUpperCase();
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  };

  sortNumerically = (colKey, direction) => {
    function sortNumAsc(gradeRowA, gradeRowB) {
      if (gradeRowA[colKey] < gradeRowB[colKey]) {
        return -1;
      }
      if (gradeRowA[colKey] > gradeRowB[colKey]) {
        return 1;
      }
      return 0;
    }

    function sortNumDesc(gradeRowA, gradeRowB) {
      if (gradeRowA[colKey] < gradeRowB[colKey]) {
        return 1;
      }
      if (gradeRowA[colKey] > gradeRowB[colKey]) {
        return -1;
      }
      return 0;
    }

    this.setState({ grades: [...this.state.grades].sort(direction === 'desc' ? sortNumDesc : sortNumAsc) });
  }

  mapHeadings = (entry) => {
    if (entry) {
      const results = [{
        label: 'Username',
        key: 'username',
        columnSortable: true,
        onSort: (direction) => {
          this.setState({
            grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
          });
        },
      }];

      const assignmentHeadings = entry.section_breakdown
        .filter(section => section.is_graded && section.label)
        .map(s => ({
          label: s.label,
          key: s.label,
          columnSortable: true,
          onSort: (direction) => { this.sortNumerically(s.label, direction); },
        }));

      const totals = [{
        label: 'Total',
        key: 'total',
        columnSortable: true,
        onSort: (direction) => { this.sortNumerically('total', direction); },
      }];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  };

  mapHeadingsHw = (entry) => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: (direction) => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
        });
      },
    }];
    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Homework')
      .map(s => ({
        label: s.label,
        key: s.label,
        columnSortable: true,
        onSort: (direction) => { this.sortNumerically(s.label, direction); },
      }));

    return results.concat(assignmentHeadings);
  };

  mapHeadingsExam = (entry) => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: (direction) => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
        });
      },
    }];
    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Exam')
      .map(s => ({
        label: s.label,
        key: s.label,
        columnSortable: true,
        onSort: (direction) => { this.sortNumerically(s.label, direction); },
      }));

    return results.concat(assignmentHeadings);
  };

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
              onChange={(event) => this.setState({updateVal: event.target.value})}
            /> / {subsection.score_possible}
          </span>
        ),
        assignmentName: `${subsection.subsection_name}`,
      }],
      modalOpen: true,
      updateModuleId: subsection.module_id,
      updateUserId: userEntry.user_id,

    })
  }

  mapUserEntriesPercent = entries => entries.map((entry) => {
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
  });

  mapUserEntriesAbsolute = entries => entries.map((entry) => {
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
  });

  handleAdjustedGradeClick = () => {
    this.props.updateGrades(this.props.match.params.courseId, [
      {
        'user_id': this.state.updateUserId,
        'usage_id': this.state.updateModuleId,
        'grade': {
          'earned_graded_override': this.state.updateVal,
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
    let mapped = entries.map(entry => ({
      id: entry.id,
      label: entry.name,
    }));
    mapped.unshift({id:0, label:'Cohorts'});
    return mapped;
  };

  mapTracksEntries = (entries) => {
    let mapped = entries.map(entry => ({
      id: entry.slug,
      label: entry.name,
    }));
    mapped.unshift({ label:'Tracks' });
    return mapped;
  };

  updateTracks = (event) => {
    const selectedTrackItem = this.props.tracks.find(x=>x.name===event);
    let selectedTrackSlug = null;
    if(selectedTrackItem) {
      selectedTrackSlug = selectedTrackItem.slug;
    }
    this.props.getUserGrades(
      this.props.match.params.courseId,
      this.props.selectedCohort,
      selectedTrackSlug,
    );
    const updatedQueryStrings = this.updateQueryParams('track', selectedTrackSlug)
    this.props.history.push(updatedQueryStrings);
  };

  updateCohorts = (event) => {
    const selectedCohortItem = this.props.cohorts.find(x=>x.name===event);
    let selectedCohortId = null;
    if(selectedCohortItem) {
      selectedCohortId = selectedCohortItem.id;
    }
    this.props.getUserGrades(
      this.props.match.params.courseId,
      selectedCohortId,
      this.props.selectedTrack,
    );
    const updatedQueryStrings = this.updateQueryParams('cohort', selectedCohortId)
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

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: '50rem' }}>
          <div className="card-body">
            <h1>Gradebook</h1>
            <hr />
            <div className="d-flex justify-content-between" >
              <div>
                <div>
                  Score View:
                  <span>
                    <input
                      id="score-view-percent"
                      className="ml-2"
                      type="radio"
                      name="score-view"
                      value="percent"
                      onClick={() => this.setState({ grades: this.mapUserEntriesPercent(this.props.results).sort(this.sortAlphaDesc) })}
                    />
                    <label className="ml-2 mr-2" htmlFor="score-view-percent">Percent</label>
                  </span>
                  <span>
                    <input
                      id="score-view-absolute"
                      type="radio"
                      name="score-view"
                      value="absolute"
                      onClick={() => this.setState({ grades: this.mapUserEntriesAbsolute(this.props.results).sort(this.sortAlphaDesc) })}
                    />
                    <label className="ml-2 mr-2" htmlFor="score-view-absolute">Absolute</label>
                  </span>
                </div>
                <div>
                  Category:
                  <span>
                    <label className="ml-2 mr-2" htmlFor="category-all">
                      <input
                        id="category-all"
                        className="ml-2"
                        type="radio"
                        name="category"
                        value="all"
                        onClick={() =>
                          this.setState({ headings: this.mapHeadings(this.props.results[0]) })}
                      />
                      All
                    </label>
                  </span>
                  <span>
                    <input
                      id="category-homework"
                      className="ml-2"
                      type="radio"
                      name="category"
                      value="homework"
                      onClick={() =>
                      this.setState({
                        headings: this.mapHeadingsHw(this.props.results[0]),
                      })}
                    />
                    <label className="ml-2 mr-2" htmlFor="category-homework">Homework</label>
                  </span>
                  <span>
                    <label className="ml-2 mr-2" htmlFor="Exam">
                      <input
                        id="category-exam"
                        type="radio"
                        name="category"
                        value="exam"
                        onClick={() => this.setState({ headings: this.mapHeadingsExam(this.props.results[0]) })}
                      />
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
                        name='Tracks'
                        value={this.mapSelectedTrackEntry(this.props.selectedTrack)}
                        options={this.mapTracksEntries(this.props.tracks)}
                        onChange={this.updateTracks}
                      />
                    }
                    {this.props.cohorts.length > 0 &&
                      <InputSelect
                        name='Cohorts'
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
                  <a href="https://www.google./com">Download Grade Report</a>
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
                columns={this.mapHeadings(this.props.grades[0])}
                data={this.mapUserEntriesPercent(this.props.grades)}
                tableSortable
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
                />
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

