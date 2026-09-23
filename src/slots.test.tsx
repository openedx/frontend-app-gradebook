import MockedMain from './Main';
import slots from './slots';

jest.mock('./Main', () => () => null);

describe('slots', () => {
  it('appends Main to the CCX Coach student grades slot', () => {
    expect(slots).toHaveLength(1);
    expect(slots[0]).toEqual(
      expect.objectContaining({
        slotId: 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1',
        op: 'widgetAppend',
        component: MockedMain,
      }),
    );
  });
});
