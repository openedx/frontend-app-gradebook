import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import WithSidebar from '.';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

const setup = ({
  filterMenuOpen = false,
  filterMenuTransitioning = false,
  handleFilterMenuTransitionEnd = jest.fn(),
} = {}) => {
  useGradebookUi.mockReturnValue({
    filterMenuOpen,
    filterMenuTransitioning,
    handleFilterMenuTransitionEnd,
  });
  return renderWithAllProviders(
    <WithSidebar sidebar={<div data-testid="sidebar">sidebar</div>}>
      <div data-testid="content">content</div>
    </WithSidebar>,
  );
};

describe('WithSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both the sidebar and the content', () => {
    setup();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('hides the sidebar when it is closed and not transitioning', () => {
    const { container } = setup({ filterMenuOpen: false, filterMenuTransitioning: false });
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('d-none');
    expect(aside).not.toHaveClass('open');
  });

  it('marks the sidebar open when filterMenuOpen is true', () => {
    const { container } = setup({ filterMenuOpen: true, filterMenuTransitioning: false });
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('open');
    expect(aside).not.toHaveClass('d-none');
  });

  it('marks the content as opening while a transition to open is running', () => {
    const { container } = setup({ filterMenuOpen: true, filterMenuTransitioning: true });
    const contents = container.querySelector('.sidebar-contents');
    expect(contents).toHaveClass('opening');
  });
});
