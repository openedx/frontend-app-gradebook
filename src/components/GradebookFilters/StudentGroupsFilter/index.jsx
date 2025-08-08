/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import messages from '../messages';
import SelectGroup from '../SelectGroup';
import useStudentGroupsFilterData from './hooks';

const mapOptions = ({ value, name }) => (
  <option key={name} value={value}>{name}</option>
);

export const StudentGroupsFilter = ({ updateQueryParams }) => {
  const { tracks, cohorts } = useStudentGroupsFilterData({ updateQueryParams });
  const { formatMessage } = useIntl();
  return (
    <>
      <SelectGroup
        id="Tracks"
        label={formatMessage(messages.tracks)}
        value={tracks.value}
        onChange={tracks.handleChange}
        options={[
          <option value={formatMessage(messages.trackAll)} key="0">
            {formatMessage(messages.trackAll)}
          </option>,
          ...tracks.entries.map(mapOptions),
        ]}
      />
      <SelectGroup
        id="Cohorts"
        label={formatMessage(messages.cohorts)}
        value={cohorts.value}
        disabled={cohorts.isDisabled}
        onChange={cohorts.handleChange}
        options={[
          <option value={formatMessage(messages.cohortAll)} key="0">
            {formatMessage(messages.cohortAll)}
          </option>,
          ...cohorts.entries.map(mapOptions),
        ]}
      />
    </>
  );
};

StudentGroupsFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default StudentGroupsFilter;
