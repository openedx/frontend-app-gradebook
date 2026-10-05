import { getLinkProps, resolveRouteByRole, useIntl } from '@openedx/frontend-base';
import { Button, Icon, Hyperlink } from '@openedx/paragon';
import { ArrowBackIos } from '@openedx/paragon/icons';

import { instructorDashboardUrl } from '@src/data/services/lms/urls';
import { useGradebookNavigation } from '@src/data/gradebookNavigationContext';
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
  const { onBack } = useGradebookNavigation();
  // Prefer the instructor dashboard route if the running site provides one,
  // so navigation stays within the SPA; otherwise fall back to a full page
  // load of the legacy LMS dashboard. Skip resolving when the host provides
  // its own onBack or the courseId isn't ready — resolveRouteByRole throws
  // "Missing :courseId param" otherwise.
  const dashboardRoute = (!onBack && courseId)
    ? resolveRouteByRole(instructorDashboardRole, { courseId })
    : null;
  const backLinkContent = (
    <>
      <Icon src={ArrowBackIos} className="mr-1" size="sm" />
      {formatMessage(messages.backToDashboard)}
    </>
  );
  const renderBackLink = () => {
    // Host-provided handler wins over URL navigation (e.g. CCX Coach tab).
    if (onBack) {
      return (
        <Button variant="link" className="mb-3 p-0" onClick={onBack}>
          {backLinkContent}
        </Button>
      );
    }
    return (
      <Hyperlink
        {...getLinkProps(dashboardRoute?.url ?? instructorDashboardUrl(courseId))}
        className="mb-3"
      >
        {backLinkContent}
      </Hyperlink>
    );
  };
  return (
    <div className="gradebook-header mt-2">
      {renderBackLink()}
      <h2 className="text-primary-500 mb-0">{formatMessage(messages.gradebook)}</h2>
      <p className="small text-break mb-3">{courseId}</p>
      <div className="subtitle-row d-flex justify-content-between align-items-center">
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
