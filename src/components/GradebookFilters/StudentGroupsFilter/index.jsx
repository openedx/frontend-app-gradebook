/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import messages from '../messages';
import SelectGroup from '../SelectGroup';

export const optionFactory = ({ data, defaultOption, key }) => [
  <option value={defaultOption} key="0">{defaultOption}</option>,
  ...data.map(
    entry => (<option key={entry[key]} value={entry.name}>{entry.name}</option>),
  ),
];

export class StudentGroupsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.mapCohortsEntries = this.mapCohortsEntries.bind(this);
    this.mapTracksEntries = this.mapTracksEntries.bind(this);
    this.updateCohorts = this.updateCohorts.bind(this);
    this.updateTracks = this.updateTracks.bind(this);
  }

  mapCohortsEntries() {
    return optionFactory({
      data: this.props.cohorts,
      defaultOption: this.translate(messages.cohortAll),
      key: 'id',
    });
  }

  mapTracksEntries() {
    return optionFactory({
      data: this.props.tracks,
      defaultOption: this.translate(messages.trackAll),
      key: 'slug',
    });
  }

  selectedTrackSlugFromEvent({ target: { value } }) {
    const selectedTrackItem = this.props.tracksByName[value];
    return selectedTrackItem ? selectedTrackItem.slug : null;
  }

  selectedCohortIdFromEvent({ target: { value } }) {
    const selectedCohortItem = this.props.cohortsByName[value];
    return selectedCohortItem ? selectedCohortItem.id.toString() : null;
  }

  updateTracks(event) {
    const track = this.selectedTrackSlugFromEvent(event);
    this.props.updateQueryParams({ track });
    this.props.updateTrack(track);
    this.props.fetchGrades();
  }

  updateCohorts(event) {
    const cohort = this.selectedCohortIdFromEvent(event);
    this.props.updateQueryParams({ cohort });
    this.props.updateCohort(cohort);
    this.props.fetchGrades();
  }

  translate(message) {
    return this.props.intl.formatMessage(message);
  }

  render() {
    return (
      <>
        <SelectGroup
          id="Tracks"
          label={this.translate(messages.tracks)}
          value={this.props.selectedTrackEntry.name}
          onChange={this.updateTracks}
          options={this.mapTracksEntries()}
        />
        <SelectGroup
          id="Cohorts"
          label={this.translate(messages.cohorts)}
          value={this.props.selectedCohortEntry.name}
          disabled={this.props.cohorts.length === 0}
          onChange={this.updateCohorts}
          options={this.mapCohortsEntries()}
        />
      </>
    );
  }
}

StudentGroupsFilter.defaultProps = {
  cohorts: [],
  cohortsByName: {},
  selectedCohortEntry: { name: '' },
  selectedTrackEntry: { name: '' },
  tracks: [],
  tracksByName: {},
};

StudentGroupsFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,

  // injected
  intl: intlShape.isRequired,

  // redux
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  cohortsByName: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  fetchGrades: PropTypes.func.isRequired,
  selectedTrackEntry: PropTypes.shape({ name: PropTypes.string }),
  selectedCohortEntry: PropTypes.shape({ name: PropTypes.string }),
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  })),
  tracksByName: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  })),
  updateCohort: PropTypes.func.isRequired,
  updateTrack: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  cohorts: selectors.cohorts.allCohorts(state),
  cohortsByName: selectors.cohorts.cohortsByName(state),
  selectedCohortEntry: selectors.root.selectedCohortEntry(state),
  selectedTrackEntry: selectors.root.selectedTrackEntry(state),
  tracks: selectors.tracks.allTracks(state),
  tracksByName: selectors.tracks.tracksByName(state),
});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  updateCohort: actions.filters.update.cohort,
  updateTrack: actions.filters.update.track,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(StudentGroupsFilter));
