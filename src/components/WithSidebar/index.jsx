import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

/**
 * WithSidebar
 * Simple wrapper around a content component, with a collapsible sidebar, whose open/closed
 * state is drawn from redux.
 *
 * Wraps child react content in a container to enable the sidebar behavior.
 *
 *  @param {JSX} children - page content
 *  @param {JSX} sidebar - sidebar content
 *
 * Ex Usage:
 *   <WithSidebar sidebar={sidebarContent} sidebarHeader={sidebarHeader}>{children}</WithSidebar>
 */
export class WithSidebar extends React.Component {
  get sidebarClassNames() {
    return classNames('sidebar', { open: this.props.open, 'd-none': this.props.isClosed });
  }

  get contentClassNames() {
    return classNames('sidebar-contents', 'position-relative', {
      opening: this.props.isOpening,
    });
  }

  render() {
    return (
      <div className="d-flex sidebar-container page-gradebook">
        <aside className={this.sidebarClassNames} onTransitionEnd={this.props.handleSlideDone}>
          { this.props.sidebar }
        </aside>
        <div className={this.contentClassNames}>
          { this.props.children}
        </div>
      </div>
    );
  }
}

WithSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebar: PropTypes.node.isRequired,
  // redux
  isClosed: PropTypes.bool.isRequired,
  isOpening: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  handleSlideDone: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  open: selectors.app.filterMenu.open(state),
  isClosed: selectors.app.filterMenu.isClosed(state),
  isOpening: selectors.app.filterMenu.isOpening(state),
});

export const mapDispatchToProps = {
  handleSlideDone: thunkActions.app.filterMenu.handleTransitionEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(WithSidebar);
