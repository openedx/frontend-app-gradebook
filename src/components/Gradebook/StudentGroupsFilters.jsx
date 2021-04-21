/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Collapsible,
  Form,
} from '@edx/paragon';

import { fetchGrades } from '../../data/actions/grades';

export class StudentGroupsFilters extends React.Component {
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
    const { cohorts, selectedCohort } = this.props;
    const filterCohorts = (x) => x.id === parseInt(selectedCohort, 10);
    const selectedCohortEntry = cohorts.find(filterCohorts);
    return selectedCohortEntry ? selectedCohortEntry.name : 'Cohorts';
  };

  mapSelectedTrackEntry = () => {
    const { selectedTrack, tracks } = this.props;
    const trackFilter = ({ slug }) => slug === selectedTrack;
    const selectedTrackEntry = tracks.find(trackFilter);
    return selectedTrackEntry ? selectedTrackEntry.name : 'Tracks';
  };

  updateTracks = (event) => {
    const {
      courseId,
      getUserGrades,
      selectedAssignmentType,
      selectedCohort,
      tracks,
      updateQueryParams,
    } = this.props;
    const selectedTrackItem = tracks.find(x => x.name === event.target.value);
    const selectedTrackSlug = selectedTrackItem ? selectedTrackItem.slug : null;

    getUserGrades(
      courseId,
      selectedCohort,
      selectedTrackSlug,
      selectedAssignmentType,
    );
    updateQueryParams({ track: selectedTrackSlug });
  };

  updateCohorts = (event) => {
    const {
      cohorts,
      courseId,
      getUserGrades,
      selectedTrack,
      selectedAssignmentType,
      updateQueryParams,
    } = this.props;
    const selectedCohortItem = cohorts.find(x => x.name === event.target.value);
    const selectedCohortId = selectedCohortItem ? selectedCohortItem.id : null;

    getUserGrades(
      courseId,
      selectedCohortId,
      selectedTrack,
      selectedAssignmentType,
    );
    updateQueryParams({ cohort: selectedCohortId });
  };

  render() {
    return (
      <Collapsible title="Student Groups" defaultOpen className="filter-group mb-3">
        <Form.Group controlId="Tracks">
          <Form.Label>Tracks</Form.Label>
          <Form.Control
            as="select"
            value={this.mapSelectedTrackEntry()}
            onChange={this.updateTracks}
          >
            {this.mapTracksEntries()}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="Cohorts">
          <Form.Label>Cohorts</Form.Label>
          <Form.Control
            as="select"
            value={this.mapSelectedCohortEntry()}
            disabled={this.props.cohorts.length === 0}
            onChange={this.updateCohorts}
          >
            {this.mapCohortsEntries()}
          </Form.Control>
        </Form.Group>
      </Collapsible>
    );
  }
}

StudentGroupsFilters.defaultProps = {
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

StudentGroupsFilters.propTypes = {
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
  tracks: state.filters.tracks,
});

export const mapDispatchToProps = {
  getUserGrades: fetchGrades,

};

export default connect(mapStateToProps, mapDispatchToProps)(StudentGroupsFilters);
