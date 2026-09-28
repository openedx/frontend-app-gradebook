import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import slots from './slots';

jest.mock('./Gradebook', () => ({
  __esModule: true,
  default: ({ courseId, onBack }: { courseId: string; onBack?: () => void }) => (
    <div data-testid="gradebook">
      <span data-testid="course-id">{courseId}</span>
      {onBack && <button type="button" onClick={onBack} data-testid="back">back</button>}
    </div>
  ),
}));

// SlotOperation is a discriminated union across renderer variants (component /
// element / iframe); narrow to the widget-component shape once for both tests.
const widgetOp = slots[0] as {
  component: React.ComponentType<{ courseId: string; onBack?: () => void }>;
};

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

  it('renders Gradebook through its own Suspense boundary and forwards courseId and onBack', async () => {
    const Widget = widgetOp.component;
    const onBack = jest.fn();
    render(<Widget courseId="course-v1:X" onBack={onBack} />);
    expect(await screen.findByTestId('course-id')).toHaveTextContent('course-v1:X');
    await userEvent.click(screen.getByTestId('back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
