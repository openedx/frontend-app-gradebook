/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { Tab, Tabs } from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import WithSidebar from 'components/WithSidebar';
import GradebookHeader from 'components/GradebookHeader';
import GradesTab from 'components/GradesTab';
import GradebookFilters from 'components/GradebookFilters';
import GradebookFiltersHeader from 'components/GradebookFiltersHeader';
import BulkManagement from 'components/BulkManagement';

export class GradebookPage extends React.Component {
  constructor(props) {
    super(props);
    this.updateQueryParams = this.updateQueryParams.bind(this);
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.initializeApp(this.props.courseId, urlQuery);
  }

  updateQueryParams(queryParams) {
    const parsed = queryString.parse(this.props.location.search);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        parsed[key] = queryParams[key];
      } else {
        delete parsed[key];
      }
    });
  }

  render() {
    return (
      <WithSidebar
        sidebar={<GradebookFilters updateQueryParams={this.updateQueryParams} />}
        sidebarHeader={<GradebookFiltersHeader />}
      >
        <div className="px-3 gradebook-content">
          <GradebookHeader />
          <Tabs defaultActiveKey="grades">
            <Tab eventKey="grades" title="Grades">
              <GradesTab updateQueryParams={this.updateQueryParams} />
            </Tab>
            {this.props.showBulkManagement && (
              <Tab eventKey="bulk_management" title="Bulk Management">
                <BulkManagement />
              </Tab>
            )}
          </Tabs>
        </div>
      </WithSidebar>
    );
  }
}
GradebookPage.defaultProps = {
  location: { search: '' },
};
GradebookPage.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }),
  courseId: PropTypes.string.isRequired,
  initializeApp: PropTypes.func.isRequired,
  showBulkManagement: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, ownProps) => ({
  courseId: ownProps.match.params.courseId,
  showBulkManagement: selectors.root.showBulkManagement(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookPage);
