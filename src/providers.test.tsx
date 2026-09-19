import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';

import providers from './providers';
import queryClient from './data/queryClient';

const Probe = () => {
  const client = useQueryClient();
  return <div data-testid="probe">{client === queryClient ? 'configured' : 'other'}</div>;
};

describe('app providers', () => {
  it('provide the configured query client to the app subtree', () => {
    const [QueryProvider] = providers;
    render(<QueryProvider><Probe /></QueryProvider>);
    expect(screen.getByTestId('probe')).toHaveTextContent('configured');
  });
});
