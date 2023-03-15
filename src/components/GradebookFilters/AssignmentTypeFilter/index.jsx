/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import SelectGroup from '../SelectGroup';
import messages from '../messages';
import useAssignmentTypeFilterData from './hooks';

export const AssignmentTypeFilter = ({ updateQueryParams }) => {
  const {
    assignmentTypes,
    handleChange,
    isDisabled,
    selectedAssignmentType,
  } = useAssignmentTypeFilterData({ updateQueryParams });
  const { formatMessage } = useIntl();
  return (
    <div className="student-filters">
      <SelectGroup
        id="assignment-types"
        label={formatMessage(messages.assignmentTypes)}
        value={selectedAssignmentType}
        onChange={handleChange}
        disabled={isDisabled}
        options={[
          <option key="0" value="">All</option>,
          ...assignmentTypes.map(entry => (
            <option key={entry} value={entry}>{entry}</option>
          )),
        ]}
      />
    </div>
  );
};

AssignmentTypeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentTypeFilter;
