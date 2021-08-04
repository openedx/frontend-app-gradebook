/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { views } from 'data/constants/app';

import WithSidebar from 'components/WithSidebar';
import GradebookHeader from 'components/GradebookHeader';
import GradesView from 'components/GradesView';
import GradebookFilters from 'components/GradebookFilters';
import BulkManagementHistoryView from 'components/BulkManagementHistoryView';

/**
 * <GradebookPage />
 * Top-level view for the Gradebook MFE.
 * Organizes a header and a pair of views (Grades and BulkManagement) with a toggle-able
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
          {(this.props.activeView === views.bulkManagementHistory
            ? <BulkManagementHistoryView />
            : <GradesView updateQueryParams={this.updateQueryParams} />
          )}
        </div>
      </WithSidebar>
    );
  }
}
GradebookPage.defaultProps = {
  location: { search: '' },
};
GradebookPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }),
  }).isRequired,
  // redux
  activeView: PropTypes.string.isRequired,
  initializeApp: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  activeView: selectors.app.activeView(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookPage);
