import { render, screen } from '@testing-library/react';
import slots from './slots';

jest.mock('./Gradebook', () => ({
  __esModule: true,
  default: ({ courseId }: { courseId: string }) => (
    <div data-testid="gradebook">{courseId}</div>
  ),
}));

describe('slots', () => {
  it('appends a lazy Gradebook widget to the CCX Coach student grades slot', () => {
    expect(slots).toHaveLength(1);
    expect(slots[0]).toEqual(
      expect.objectContaining({
        slotId: 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1',
        op: 'widgetAppend',
      }),
    );
    expect(typeof slots[0].component).toBe('function');
  });

  it('renders Gradebook through its own Suspense boundary and forwards courseId', async () => {
    const Widget = slots[0].component! as React.ComponentType<{ courseId: string }>;
    render(<Widget courseId="course-v1:X" />);
    expect(await screen.findByTestId('gradebook')).toHaveTextContent('course-v1:X');
  });
});
