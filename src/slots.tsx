import { lazy, Suspense } from 'react';
import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import { Spinner } from '@openedx/paragon';

// Lazy so the gradebook bundle isn't pulled into hosts that never render this slot.
const Gradebook = lazy(() => import('./Gradebook'));

// Slot id renders gradebook MFE inside student grades tab on ccx coach dashboard
const studentGradesSlotId = 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1';

interface GradebookWidgetProps {
  courseId: string;
  onBack?: () => void;
}

// Framed spinner instead of a blank tab while the chunk loads.
const GradebookWidgetFallback = () => (
  <div className="d-flex justify-content-center p-4">
    <Spinner animation="border" variant="dark" screenReaderText="Loading gradebook" />
  </div>
);

// Own Suspense boundary: the host slot doesn't provide one.
const GradebookWidget = ({ courseId, onBack }: GradebookWidgetProps) => (
  <Suspense fallback={<GradebookWidgetFallback />}>
    <Gradebook courseId={courseId} onBack={onBack} />
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
