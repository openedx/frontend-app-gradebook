/* eslint-disable import/no-named-as-default */
import React from 'react';
import queryString from 'query-string';
import { useNavigate, useLocation } from 'react-router-dom';

import { useGradebookUi } from 'data/gradebookUiContext';
import { views } from 'data/constants/app';

import WithSidebar from 'components/WithSidebar';
import GradebookHeader from 'components/GradebookHeader';
import GradesView from 'components/GradesView';
import GradebookFilters from 'components/GradebookFilters';
import BulkManagementHistoryView from 'components/BulkManagementHistoryView';

import GradebookDataLoader from './GradebookDataLoader';

/**
 * <GradebookPage />
 * Top-level view for the Gradebook MFE.
 * Organizes a header and a pair of views (Grades and BulkManagement) with a toggle-able
 * filter sidebar.
 */
export const GradebookPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeView } = useGradebookUi();

  const updateQueryParams = (queryParams) => {
    const { pathname } = location;
    const parsed = queryString.parse(location.search);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        parsed[key] = queryParams[key];
      } else {
        delete parsed[key];
      }
    });
    navigate({ pathname, search: `?${queryString.stringify(parsed)}` });
  };

  return (
    <>
      <GradebookDataLoader />
      <WithSidebar
        sidebar={<GradebookFilters updateQueryParams={updateQueryParams} />}
      >
        <div className="px-3 gradebook-content">
          <GradebookHeader />
          {(activeView === views.bulkManagementHistory
            ? <BulkManagementHistoryView />
            : <GradesView updateQueryParams={updateQueryParams} />
          )}
        </div>
      </WithSidebar>
    </>
  );
};

export default GradebookPage;

// MIGRATION (Redux -> React Query/React state): old connected class component kept
// (commented) until teardown.
//
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import selectors from 'data/selectors';
// import { withParams, withNavigate, withLocation } from '../../utils/hoc';
//
// export class GradebookPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.updateQueryParams = this.updateQueryParams.bind(this);
//   }
//
//   componentDidMount() {
//     const urlQuery = queryString.parse(this.props.location.search);
//     this.props.initializeApp(this.props.courseId, urlQuery);
//   }
//
//   updateQueryParams(queryParams) {
//     const { pathname } = this.props.location;
//     const parsed = queryString.parse(this.props.location.search);
//     Object.keys(queryParams).forEach((key) => {
//       if (queryParams[key]) {
//         parsed[key] = queryParams[key];
//       } else {
//         delete parsed[key];
//       }
//     });
//     this.props.navigate({ pathname, search: `?${queryString.stringify(parsed)}` });
//   }
//
//   render() {
//     return (
//       <>
//         <GradebookDataLoader />
//         <WithSidebar
//           sidebar={<GradebookFilters updateQueryParams={this.updateQueryParams} />}
//         >
//           <div className="px-3 gradebook-content">
//             <GradebookHeader />
//             {(this.props.activeView === views.bulkManagementHistory
//               ? <BulkManagementHistoryView />
//               : <GradesView updateQueryParams={this.updateQueryParams} />
//             )}
//           </div>
//         </WithSidebar>
//       </>
//     );
//   }
// }
// GradebookPage.defaultProps = {
//   location: { pathname: '/', search: '' },
// };
// GradebookPage.propTypes = {
//   navigate: PropTypes.func.isRequired,
//   location: PropTypes.shape({ pathname: PropTypes.string, search: PropTypes.string }),
//   courseId: PropTypes.string.isRequired,
//   // redux
//   activeView: PropTypes.string.isRequired,
//   initializeApp: PropTypes.func.isRequired,
// };
//
// export const mapStateToProps = (state) => ({
//   activeView: selectors.app.activeView(state),
// });
//
// export const mapDispatchToProps = {
//   initializeApp: thunkActions.app.initialize,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(
//   withParams(withNavigate(withLocation(GradebookPage))),
// );
