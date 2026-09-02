import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useGradebookUi } from 'data/gradebookUiContext';

// MIGRATION (Redux -> React state): the filter sidebar open/transition state moved
// from the Redux `app.filterMenu` slice to the GradebookUiProvider. WithSidebar was
// a connected class component reading that slice via mapStateToProps; it is now a
// function component that reads the same state (and the onTransitionEnd handler)
// from the UI context. The old Redux-connected implementation is kept below,
// commented, until teardown.
//
// import { connect } from 'react-redux';
// import selectors from 'data/selectors';
// import thunkActions from 'data/thunkActions';
//
// export class WithSidebar extends React.Component {
//   get sidebarClassNames() {
//     return classNames('sidebar', { open: this.props.open, 'd-none': this.props.isClosed });
//   }
//
//   get contentClassNames() {
//     return classNames('sidebar-contents', 'position-relative', {
//       opening: this.props.isOpening,
//     });
//   }
//
//   render() {
//     return (
//       <div className="d-flex sidebar-container page-gradebook">
//         <aside className={this.sidebarClassNames} onTransitionEnd={this.props.handleSlideDone}>
//           { this.props.sidebar }
//         </aside>
//         <div className={this.contentClassNames}>
//           { this.props.children}
//         </div>
//       </div>
//     );
//   }
// }
//
// WithSidebar.propTypes = {
//   children: PropTypes.node.isRequired,
//   sidebar: PropTypes.node.isRequired,
//   // redux
//   isClosed: PropTypes.bool.isRequired,
//   isOpening: PropTypes.bool.isRequired,
//   open: PropTypes.bool.isRequired,
//   handleSlideDone: PropTypes.func.isRequired,
// };
//
// export const mapStateToProps = (state) => ({
//   open: selectors.app.filterMenu.open(state),
//   isClosed: selectors.app.filterMenu.isClosed(state),
//   isOpening: selectors.app.filterMenu.isOpening(state),
// });
//
// export const mapDispatchToProps = {
//   handleSlideDone: thunkActions.app.filterMenu.handleTransitionEnd,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(WithSidebar);

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
