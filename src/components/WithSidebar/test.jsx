import React from 'react';

import { render, screen, initializeMocks } from 'testUtilsExtra';

import { WithSidebar, mapStateToProps, mapDispatchToProps } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/selectors', () => ({
  app: {
    filterMenu: {
      open: jest.fn(),
      isClosed: jest.fn(),
      isOpening: jest.fn(),
    },
  },
}));

jest.mock('data/thunkActions', () => ({
  app: {
    filterMenu: {
      handleTransitionEnd: jest.fn(),
    },
  },
}));

const selectors = require('data/selectors');
const thunkActions = require('data/thunkActions');

initializeMocks();

describe('WithSidebar', () => {
  const defaultProps = {
    children: <div>Main Content</div>,
    sidebar: <div>Sidebar Content</div>,
    open: false,
    isClosed: true,
    isOpening: false,
    handleSlideDone: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    render(<WithSidebar {...defaultProps} />);

    expect(document.body).toBeInTheDocument();
  });

  it('renders main content', () => {
    render(<WithSidebar {...defaultProps} />);

    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders sidebar content', () => {
    render(<WithSidebar {...defaultProps} />);

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('applies correct container classes', () => {
    render(<WithSidebar {...defaultProps} />);

    const container = screen
      .getByText('Main Content')
      .closest('.sidebar-container');
    expect(container).toHaveClass(
      'd-flex',
      'sidebar-container',
      'page-gradebook',
    );
  });

  describe('sidebar states', () => {
    it('applies closed sidebar classes when isClosed is true', () => {
      render(<WithSidebar {...defaultProps} isClosed />);

      const sidebar = screen.getByText('Sidebar Content').closest('aside');
      expect(sidebar).toHaveClass('sidebar', 'd-none');
      expect(sidebar).not.toHaveClass('open');
    });

    it('applies open sidebar classes when open is true', () => {
      const props = {
        ...defaultProps,
        open: true,
        isClosed: false,
      };
      render(<WithSidebar {...props} />);

      const sidebar = screen.getByText('Sidebar Content').closest('aside');
      expect(sidebar).toHaveClass('sidebar', 'open');
      expect(sidebar).not.toHaveClass('d-none');
    });

    it('applies opening content classes when isOpening is true', () => {
      const props = {
        ...defaultProps,
        isOpening: true,
      };
      render(<WithSidebar {...props} />);

      const content = screen
        .getByText('Main Content')
        .closest('.sidebar-contents');
      expect(content).toHaveClass(
        'sidebar-contents',
        'position-relative',
        'opening',
      );
    });

    it('does not apply opening class when isOpening is false', () => {
      render(<WithSidebar {...defaultProps} />);

      const content = screen
        .getByText('Main Content')
        .closest('.sidebar-contents');
      expect(content).toHaveClass('sidebar-contents', 'position-relative');
      expect(content).not.toHaveClass('opening');
    });
  });

  describe('event handlers', () => {
    it('calls handleSlideDone on sidebar transition end', () => {
      const handleSlideDone = jest.fn();
      const props = {
        ...defaultProps,
        handleSlideDone,
      };

      render(<WithSidebar {...props} />);

      const sidebar = screen.getByText('Sidebar Content').closest('aside');
      sidebar.dispatchEvent(new Event('transitionend', { bubbles: true }));

      expect(handleSlideDone).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapStateToProps', () => {
    it('maps filter menu state properties', () => {
      const mockState = { app: { filterMenu: {} } };

      selectors.app.filterMenu.open.mockReturnValue(true);
      selectors.app.filterMenu.isClosed.mockReturnValue(false);
      selectors.app.filterMenu.isOpening.mockReturnValue(true);

      const result = mapStateToProps(mockState);

      expect(selectors.app.filterMenu.open).toHaveBeenCalledWith(mockState);
      expect(selectors.app.filterMenu.isClosed).toHaveBeenCalledWith(mockState);
      expect(selectors.app.filterMenu.isOpening).toHaveBeenCalledWith(
        mockState,
      );

      expect(result).toEqual({
        open: true,
        isClosed: false,
        isOpening: true,
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps handleSlideDone action', () => {
      expect(mapDispatchToProps.handleSlideDone).toBe(
        thunkActions.app.filterMenu.handleTransitionEnd,
      );
    });
  });

  describe('component structure and accessibility', () => {
    it('uses semantic aside element for sidebar', () => {
      render(<WithSidebar {...defaultProps} />);

      const sidebar = screen.getByRole('complementary');
      expect(sidebar.tagName).toBe('ASIDE');
      expect(sidebar).toContainElement(screen.getByText('Sidebar Content'));
    });

    it('renders content in a properly structured container', () => {
      render(<WithSidebar {...defaultProps} />);

      const content = screen.getByText('Main Content');
      const contentContainer = content.closest('.sidebar-contents');

      expect(contentContainer).toHaveClass(
        'sidebar-contents',
        'position-relative',
      );
      expect(contentContainer).toContainElement(content);
    });
  });

  describe('class name computation', () => {
    it('computes sidebar class names correctly for different states', () => {
      const { rerender } = render(<WithSidebar {...defaultProps} />);

      let sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('sidebar', 'd-none');
      expect(sidebar).not.toHaveClass('open');

      rerender(<WithSidebar {...defaultProps} open isClosed={false} />);
      sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('sidebar', 'open');
      expect(sidebar).not.toHaveClass('d-none');
    });

    it('computes content class names correctly for different states', () => {
      const { rerender } = render(<WithSidebar {...defaultProps} />);

      let content = screen
        .getByText('Main Content')
        .closest('.sidebar-contents');
      expect(content).toHaveClass('sidebar-contents', 'position-relative');
      expect(content).not.toHaveClass('opening');

      rerender(<WithSidebar {...defaultProps} isOpening />);
      content = screen.getByText('Main Content').closest('.sidebar-contents');
      expect(content).toHaveClass(
        'sidebar-contents',
        'position-relative',
        'opening',
      );
    });
  });
});
