/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Tabs,
} from '@edx/paragon';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import PageButtons from '../PageButtons';
import Drawer from '../Drawer';
import ConnectedFilterBadges from '../FilterBadges';

import GradebookHeader from './GradebookHeader';
import BulkManagement from './BulkManagement';
import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import GradebookFilters from './GradebookFilters';
import GradebookTable from './GradebookTable';
import SearchControls from './SearchControls';
import StatusAlerts from './StatusAlerts';
import SpinnerIcon from './SpinnerIcon';
import ScoreViewInput from './ScoreViewInput';
import UsersLabel from './UsersLabel';

export default class Gradebook extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.initializeApp(this.props.courseId, urlQuery);
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
    this.updateQueryParams(filterNames.reduce(
      (obj, filterName) => ({ ...obj, [filterName]: false }),
      {},
    ));
    this.props.fetchGrades();
  }

  render() {
    return (
      <Drawer
        mainContent={toggleFilterDrawer => (
          <div className="px-3 gradebook-content">
            <GradebookHeader />
            <Tabs defaultActiveKey="grades">
              <Tab eventKey="grades" title="Grades">
                <SpinnerIcon />
                <SearchControls toggleFilterDrawer={toggleFilterDrawer} />
                <ConnectedFilterBadges handleFilterBadgeClose={this.handleFilterBadgeClose} />
                <StatusAlerts />

                <h4>Step 2: View or Modify Individual Grades</h4>
                <UsersLabel />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <ScoreViewInput />
                  <BulkManagementControls />
                </div>
                <PageButtons {...this.props} />

                <GradebookTable />
                <PageButtons />

                <p>* available for learners in the Master&apos;s track only</p>
                <EditModal />
              </Tab>
              {this.props.showBulkManagement
                && (
                <Tab eventKey="bulk_management" title="Bulk Management">
                  <BulkManagement />
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
        <GradebookFilters updateQueryParams={this.updateQueryParams} />
      </Drawer>
    );
  }
}

Gradebook.defaultProps = {
  courseId: '',
  location: {
    search: '',
  },
  showBulkManagement: false,
};

Gradebook.propTypes = {
  courseId: PropTypes.string,
  fetchGrades: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  initializeApp: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  resetFilters: PropTypes.func.isRequired,
  showBulkManagement: PropTypes.bool,
};
