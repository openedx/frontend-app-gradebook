import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import { appId } from './constants';
import Main from './Main';

// Slot id renders gradebook MFE inside student grades tab on ccx coach dashboard
const studentGradesSlotId = 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1';

const slots: SlotOperation[] = [
  {
    slotId: studentGradesSlotId,
    id: `${appId}.widget.studentGrades.v1`,
    op: WidgetOperationTypes.APPEND,
    component: Main,
  },
];

export default slots;
