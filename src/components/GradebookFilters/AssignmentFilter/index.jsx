/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import messages from '../messages';
import SelectGroup from '../SelectGroup';
import useAssignmentFilterData from './hooks';

const AssignmentFilter = ({ updateQueryParams }) => {
  const {
    handleChange,
    selectedAssignmentLabel,
    assignmentFilterOptions,
  } = useAssignmentFilterData({ updateQueryParams });
  const { formatMessage } = useIntl();
  const filterOptions = assignmentFilterOptions.map(({ label, subsectionLabel }) => (
    <option key={label} value={label}>
      {label}: {subsectionLabel}
    </option>
  ));
  return (
    <div className="student-filters">
      <SelectGroup
        id="assignment"
        label={formatMessage(messages.assignment)}
        value={selectedAssignmentLabel}
        onChange={handleChange}
        disabled={assignmentFilterOptions.length === 0}
        options={[
          <option key="0" value="">All</option>,
          ...filterOptions,
        ]}
      />
    </div>
  );
};

AssignmentFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentFilter;
