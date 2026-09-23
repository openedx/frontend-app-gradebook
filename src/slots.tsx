import { lazy, Suspense } from 'react';
import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';

// Lazy so the gradebook bundle isn't pulled into hosts that never render this slot.
const Gradebook = lazy(() => import('./Gradebook'));

// Slot id renders gradebook MFE inside student grades tab on ccx coach dashboard
const studentGradesSlotId = 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1';

// Own Suspense boundary: the host slot doesn't provide one.
const GradebookWidget = () => (
  <Suspense fallback={null}>
    <Gradebook />
  </Suspense>
);

const slots: SlotOperation[] = [
  {
    slotId: studentGradesSlotId,
    id: 'org.openedx.frontend.widget.gradebook.studentGrades.v1',
    op: WidgetOperationTypes.APPEND,
    component: GradebookWidget,
  },
];

export default slots;
