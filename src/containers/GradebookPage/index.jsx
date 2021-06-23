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
import BulkManagementTab from 'components/BulkManagementTab';

/**
 * <GradebookPage />
 * Top-level view for the Gradebook MFE.
 * Organizes a header and a pair of tabs (Grades and BulkManagement) with a toggle-able
 * filter sidebar.
 */
export class GradebookPage extends React.Component {
  constructor(props) {
    super(props);
    this.updateQueryParams = this.updateQueryParams.bind(this);
  }

  componentDidMount() {
    const urlQuery = queryString.parse(this.props.location.search);
    this.props.initializeApp(this.props.match.params.courseId, urlQuery);
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
    this.props.history.push(`?${queryString.stringify(parsed)}`);
  }

  render() {
    return (
      <WithSidebar
        sidebar={<GradebookFilters updateQueryParams={this.updateQueryParams} />}
      >
        <div className="px-3 gradebook-content">
          <GradebookHeader />
          <Tabs defaultActiveKey="grades">
            <Tab eventKey="grades" title="Grades">
              <GradesTab updateQueryParams={this.updateQueryParams} />
            </Tab>
            {this.props.showBulkManagement && (
              <Tab eventKey="bulk_management" title="Bulk Management">
                <BulkManagementTab />
              </Tab>
            )}
          </Tabs>
        </div>
      </WithSidebar>
    );
  }
}
GradebookPage.defaultProps = {
  showBulkManagement: false,
  location: { search: '' },
};
GradebookPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }),
  initializeApp: PropTypes.func.isRequired,
  showBulkManagement: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }),
  }).isRequired,
};

export const mapStateToProps = (state) => ({
  showBulkManagement: selectors.root.showBulkManagement(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookPage);
