import { renderWithAllProviders, initializeMocks } from '@src/testUtils';
import { screen } from '@testing-library/react';

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
      renderWithAllProviders(<PercentGroup {...props} />);
      expect(screen.getByRole('spinbutton', { name: 'Group Label' })).toBeInTheDocument();
      expect(screen.getByText('Group Label')).toBeVisible();
      expect(screen.getByText('%')).toBeVisible();
    });
    test('disabled', () => {
      renderWithAllProviders(<PercentGroup {...props} disabled />);
      expect(screen.getByRole('spinbutton', { name: 'Group Label' })).toBeDisabled();
      expect(screen.getByText('Group Label')).toBeVisible();
      expect(screen.getByText('%')).toBeVisible();
    });
  });
});
