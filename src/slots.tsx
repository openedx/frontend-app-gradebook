import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import GradebookMenuItem from './components/menus/GradebookMenuItem';

const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
    id: 'org.openedx.frontend.widget.gradebookMenu.headerLink',
    op: WidgetOperationTypes.APPEND,
    element: (
      <GradebookMenuItem label="Courses" role="org.openedx.frontend.role.learnerDashboard" variant="navLink" />
    )
  },
];

export default slots;
