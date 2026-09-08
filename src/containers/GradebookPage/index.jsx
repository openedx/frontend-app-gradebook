import queryString from 'query-string';
import { useNavigate, useLocation } from 'react-router-dom';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';

import WithSidebar from '@src/components/WithSidebar';
import GradebookHeader from '@src/components/GradebookHeader';
import GradesView from '@src/components/GradesView';
import GradebookFilters from '@src/components/GradebookFilters';
import BulkManagementHistoryView from '@src/components/BulkManagementHistoryView';

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