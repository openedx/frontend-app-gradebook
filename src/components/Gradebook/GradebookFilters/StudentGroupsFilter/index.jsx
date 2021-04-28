/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchGrades } from 'data/actions/grades';
import SelectGroup from '../SelectGroup';

export class StudentGroupsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.updateCohorts = this.updateCohorts.bind(this);
    this.updateTracks = this.updateTracks.bind(this);
  }

  mapCohortsEntries = () => {
    const mapper = ({ id, name }) => (
      <option key={id} value={name}>{name}</option>
    );
    return [
      <option value="Cohort-All" key="0">Cohort-All</option>,
      ...this.props.cohorts.map(mapper),
    ];
  };

  mapTracksEntries = () => {
    const mapper = ({ slug, name }) => (
      <option key={slug} value={name}>{name}</option>
    );
    return [
      <option value="Track-All" key="0">Track-All</option>,
      ...this.props.tracks.map(mapper),
    ];
  };

  mapSelectedCohortEntry = () => {
    const selectedCohortEntry = this.props.cohorts.find(
      (x) => x.id === parseInt(this.props.selectedCohort, 10),
    );
    return selectedCohortEntry ? selectedCohortEntry.name : 'Cohorts';
  };

  mapSelectedTrackEntry = () => {
    const selectedTrackEntry = this.props.tracks.find(
      ({ slug }) => slug === this.props.selectedTrack,
    );
    return selectedTrackEntry ? selectedTrackEntry.name : 'Tracks';
  };

  selectedTrackSlugFromEvent(event) {
    const selectedTrackItem = this.props.tracks.find(
      ({ name }) => name === event.target.value,
    );
    return selectedTrackItem ? selectedTrackItem.slug : null;
  }

  selectedCohortIdFromEvent(event) {
    const selectedCohortItem = this.props.cohorts.find(
      x => x.name === event.target.value,
    );
    return selectedCohortItem ? selectedCohortItem.id.toString() : null;
  }

  updateTracks(event) {
    const selectedTrackSlug = this.selectedTrackSlugFromEvent(event);
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      selectedTrackSlug,
      this.props.selectedAssignmentType,
    );
    this.props.updateQueryParams({ track: selectedTrackSlug });
  }

  updateCohorts(event) {
    const selectedCohortId = this.selectedCohortIdFromEvent(event);
    this.props.getUserGrades(
      this.props.courseId,
      selectedCohortId,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
    this.props.updateQueryParams({ cohort: selectedCohortId });
  }

  render() {
    return (
      <>
        <SelectGroup
          id="Tracks"
          label="Tracks"
          value={this.mapSelectedTrackEntry()}
          onChange={this.updateTracks}
          options={this.mapTracksEntries()}
        />
        <SelectGroup
          id="Cohorts"
          label="Cohorts"
          value={this.mapSelectedCohortEntry()}
          disabled={this.props.cohorts.length === 0}
          onChange={this.updateCohorts}
          options={this.mapCohortsEntries()}
        />
      </>
    );
  }
}

StudentGroupsFilter.defaultProps = {
  /** testing
  cohorts: [
    { name: 'Fake Cohort 1', id: 'fake_cohort_1' },
    { name: 'Fake Cohort 2', id: 'fake_cohort_2' },
  ],
  tracks: [
    { name: 'Fake Track 1', slug: 'fake_track_1' },
    { name: 'Fake Track 2', slug: 'fake_track_2' },
  ],
  */

  cohorts: [],
  courseId: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
  tracks: [],
};

StudentGroupsFilter.propTypes = {
  courseId: PropTypes.string,
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  getUserGrades: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  })),
};

export const mapStateToProps = (state) => ({
  cohorts: state.cohorts.results,
  selectedAssignmentType: state.filters.assignmentType,
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
  tracks: state.tracks.results,
});

export const mapDispatchToProps = {
  getUserGrades: fetchGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentGroupsFilter);
