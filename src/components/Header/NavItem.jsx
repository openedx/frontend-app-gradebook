import React from 'react';
import classNames from 'classnames';

import { Hyperlink } from '@edx/paragon';


export default class NavItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submenuOpen: false
    }

    this.toggleSubmenu = this.toggleSubmenu.bind(this)
  }

  toggleSubmenu() {
    this.setState({
      submenuOpen: !this.state.submenuOpen
    })
  }

  renderSubmenu() {
    return (
      <ul className={classNames('submenu', {'open':this.state.submenuOpen})}>
        {this.props.submenu}
      </ul>
    )
  }

  render() {
    return (
      <li className={classNames('nav-item', {
        'has-submenu': this.props.submenu
      })}>
        {this.props.submenu ? (
          <button
            onClick={this.toggleSubmenu}
          >
            {this.props.title}
          </button>
        ) : (
          <Hyperlink content={this.props.title} destination={this.props.destination} />
        )}

        {this.props.submenu ? this.renderSubmenu() : null}
        
      </li>
    );
  }
}

NavItem.defaultProps = {
  title: "Nav Item",
  destination: null,
  submenu: null
}
