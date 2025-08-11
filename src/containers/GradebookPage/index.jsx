/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import selectors from '../../data/selectors';
import thunkActions from '../../data/thunkActions';
import { views } from '../../data/constants/app';

import WithSidebar from '../../components/WithSidebar';
import GradebookHeader from '../../components/GradebookHeader';
import GradesView from '../../components/GradesView';
import GradebookFilters from '../../components/GradebookFilters';
import BulkManagementHistoryView from '../../components/BulkManagementHistoryView';

/**
 * <GradebookPage />
 * Top-level view for the Gradebook MFE.
 * Organizes a header and a pair of views (Grades and BulkManagement) with a toggle-able
 * filter sidebar.
 */
export const GradebookPage = () => {

  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const activeView = useSelector(selectors.app.activeView);

  useEffect(() => {
    const urlQuery = queryString.parse(location.search);
    dispatch(thunkActions.app.initialize(courseId, urlQuery));
  }, [courseId, location.search, dispatch]);

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
  );
};

export default GradebookPage;
