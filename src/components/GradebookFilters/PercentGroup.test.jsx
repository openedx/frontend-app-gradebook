import { render, screen, initializeMocks } from 'testUtilsExtra';

import PercentGroup from './PercentGroup';

describe('PercentGroup', () => {
  let props = {
    id: 'group id',
    label: 'Group Label',
    value: 'group VALUE',
    disabled: false,
  };

  beforeEach(() => {
    initializeMocks();
    props = {
      ...props,
      onChange: jest.fn().mockName('props.onChange'),
    };
  });

  describe('Component', () => {
    test('is displayed', () => {
      render(<PercentGroup {...props} />);
      expect(screen.getByRole('spinbutton', { name: 'Group Label' })).toBeInTheDocument();
      expect(screen.getByText('Group Label')).toBeVisible();
      expect(screen.getByText('%')).toBeVisible();
    });
    test('disabled', () => {
      render(<PercentGroup {...props} disabled />);
      expect(screen.getByRole('spinbutton', { name: 'Group Label' })).toBeDisabled();
      expect(screen.getByText('Group Label')).toBeVisible();
      expect(screen.getByText('%')).toBeVisible();
    });
  });
});
