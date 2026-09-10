import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useGradebookUi } from '@src/data/gradebookUiContext';

/**
 * WithSidebar
 * Simple wrapper around a content component, with a collapsible sidebar, whose
 * open/closed state is drawn from the GradebookUiProvider.
 *
 * Wraps child react content in a container to enable the sidebar behavior.
 *
 *  @param {JSX} children - page content
 *  @param {JSX} sidebar - sidebar content
 *
 * Ex Usage:
 *   <WithSidebar sidebar={sidebarContent}>{children}</WithSidebar>
 */
export const WithSidebar = ({ children, sidebar }) => {
  const {
    filterMenuOpen: open,
    filterMenuTransitioning: transitioning,
    handleFilterMenuTransitionEnd,
  } = useGradebookUi();

  // Derived states previously computed by the Redux `filterMenu` selectors.
  const isClosed = !open && !transitioning;
  const isOpening = transitioning && open;

  const sidebarClassNames = classNames('sidebar', { open, 'd-none': isClosed });
  const contentClassNames = classNames('sidebar-contents', 'position-relative', {
    opening: isOpening,
  });

  return (
    <div className="d-flex sidebar-container page-gradebook">
      <aside className={sidebarClassNames} onTransitionEnd={handleFilterMenuTransitionEnd}>
        { sidebar }
      </aside>
      <div className={contentClassNames}>
        { children }
      </div>
    </div>
  );
};

WithSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebar: PropTypes.node.isRequired,
};

export default WithSidebar;
