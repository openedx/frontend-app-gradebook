import { render, screen } from '@testing-library/react';
import slots from './slots';

jest.mock('./Gradebook', () => ({
  __esModule: true,
  default: ({ courseId }: { courseId: string }) => (
    <div data-testid="gradebook">{courseId}</div>
  ),
}));

// SlotOperation is a discriminated union across renderer variants (component /
// element / iframe); narrow to the widget-component shape once for both tests.
const widgetOp = slots[0] as { component: React.ComponentType<{ courseId: string }> };

describe('slots', () => {
  it('appends a lazy Gradebook widget to the CCX Coach student grades slot', () => {
    expect(slots).toHaveLength(1);
    expect(slots[0]).toEqual(
      expect.objectContaining({
        slotId: 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1',
        op: 'widgetAppend',
      }),
    );
    expect(typeof widgetOp.component).toBe('function');
  });

  it('renders Gradebook through its own Suspense boundary and forwards courseId', async () => {
    const Widget = widgetOp.component;
    render(<Widget courseId="course-v1:X" />);
    expect(await screen.findByTestId('gradebook')).toHaveTextContent('course-v1:X');
  });
});
