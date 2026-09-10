import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useFilterBadgeConfig } from '../data/hooks';
import FilterBadge from './FilterBadge';

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useFilterBadgeConfig: jest.fn(),
}));

describe('FilterBadge', () => {
  const filterName = 'test-filter-name';
  const innerClose = jest.fn();
  const handleClose = jest.fn(() => innerClose);

  const hookProps = {
    displayName: { id: 'test.id', defaultMessage: 'a common name' },
    isDefault: false,
    hideValue: false,
    value: 'a common value',
    connectedFilters: ['some', 'filters'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useFilterBadgeConfig.mockReturnValue(hookProps);
  });

  it('renders nothing when the filter value is the default', () => {
    useFilterBadgeConfig.mockReturnValue({ ...hookProps, isDefault: true });
    const { container } = renderWithAllProviders(
      <FilterBadge filterName={filterName} handleClose={handleClose} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the display name and the value', () => {
    renderWithAllProviders(<FilterBadge filterName={filterName} handleClose={handleClose} />);
    expect(screen.getByTestId('display-name')).toHaveTextContent(hookProps.displayName.defaultMessage);
    expect(screen.getByTestId('filter-value')).toHaveTextContent(`: ${hookProps.value}`);
  });

  it('hides the value when hideValue is set', () => {
    useFilterBadgeConfig.mockReturnValue({ ...hookProps, hideValue: true });
    renderWithAllProviders(<FilterBadge filterName={filterName} handleClose={handleClose} />);
    expect(screen.getByTestId('filter-value')).toHaveTextContent('');
  });

  it('wires handleClose(connectedFilters) as the click handler', async () => {
    renderWithAllProviders(<FilterBadge filterName={filterName} handleClose={handleClose} />);
    expect(handleClose).toHaveBeenCalledWith(hookProps.connectedFilters);
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(innerClose).toHaveBeenCalled();
  });
});
