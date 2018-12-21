import React from 'react';
import classNames from 'classnames';


export default class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItemIndex: -1
    }
  }


  openMenu(itemIndex, event) {
    console.log("Open menu " + itemIndex, "Current menu: " + this.state.activeItemIndex);

    this.setState({activeItemIndex: itemIndex});
  }

  closeMenu(itemIndex, event) {
    console.log("Close menu " + itemIndex, "Current menu: " + this.state.activeItemIndex);

    // Close only if the request came from the currently open menu
    // TODO - Unsure if this check is needed
    if (this.state.activeItemIndex !== itemIndex) return;


    this.setState({activeItemIndex: -1});
  }

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        openMenu: this.openMenu.bind(this, index),
        closeMenu: this.closeMenu.bind(this, index),
        isActive: index === this.state.activeItemIndex
      });
    });

    return (
      <nav 
        className={classNames("edx-nav", {
          "menu-is-open": this.state.activeItemIndex !== -1
        })}
        aria-label={this.props.ariaLabel}
      >
        <div className="edx-nav-children">
          {children}
        </div>
      </nav>
    );
  }
}

Nav.defaultProps = {
  ariaLabel: "Main Navigation"
}
