import { render, screen } from '@testing-library/react';
import slots from './slots';

jest.mock('./Gradebook', () => () => <div data-testid="gradebook" />);

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

  it('renders Gradebook through its own Suspense boundary', async () => {
    const Widget = slots[0].component!;
    render(<Widget />);
    expect(await screen.findByTestId('gradebook')).toBeInTheDocument();
  });
});
