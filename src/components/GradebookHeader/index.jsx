import { Link } from 'react-router-dom';

import { resolveRouteByRole, useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';

import { instructorDashboardUrl } from '@src/data/services/lms/urls';
import useGradebookHeaderData from './hooks';
import messages from './messages';

const instructorDashboardRole = 'org.openedx.frontend.role.instructorDashboard';

export const GradebookHeader = () => {
  const { formatMessage } = useIntl();
  const {
    areGradesFrozen,
    canUserViewGradebook,
    courseId,
    handleToggleViewClick,
    showBulkManagement,
    toggleViewMessage,
  } = useGradebookHeaderData();
  // Prefer the instructor dashboard route if the running site provides one,
  // so navigation stays within the SPA; otherwise fall back to a full page
  // load of the legacy LMS dashboard.
  const dashboardRoute = resolveRouteByRole(instructorDashboardRole, { courseId });
  const backLinkContent = (
    <>
      <span aria-hidden="true">{'<< '}</span>
      {formatMessage(messages.backToDashboard)}
    </>
  );
  return (
    <div className="gradebook-header">
      {dashboardRoute?.isInternal ? (
        <Link to={dashboardRoute.url} className="mb-3">{backLinkContent}</Link>
      ) : (
        <a href={dashboardRoute?.url ?? instructorDashboardUrl()} className="mb-3">{backLinkContent}</a>
      )}
      <h1>{formatMessage(messages.gradebook)}</h1>
      <div className="subtitle-row d-flex justify-content-between align-items-center">
        <h2 className="text-break">{courseId}</h2>
        {showBulkManagement && (
          <Button variant="tertiary" onClick={handleToggleViewClick}>
            {formatMessage(toggleViewMessage)}
          </Button>
        )}
      </div>
      {areGradesFrozen && (
        <div className="alert alert-warning" role="alert">
          {formatMessage(messages.frozenWarning)}
        </div>
      )}
      {(canUserViewGradebook === false) && (
        <div className="alert alert-warning" role="alert">
          {formatMessage(messages.unauthorizedWarning)}
        </div>
      )}
    </div>
  );
};

export default GradebookHeader;
