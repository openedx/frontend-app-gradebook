import { LinkMenuItem, SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import { baseDashboardUrl } from './data/services/lms/urls';

const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
    id: 'org.openedx.frontend.widget.gradebookMenu.headerLink',
    op: WidgetOperationTypes.APPEND,
    element: (
      <LinkMenuItem
        label="Courses"
        url={baseDashboardUrl()}
        variant="navLink"
      />
    )
  },
];

export default slots;
