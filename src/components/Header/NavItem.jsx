import React from 'react';
import classNames from 'classnames';

import { Hyperlink } from '@edx/paragon';


export default class NavItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classNames('nav-item', {
        'has-submenu': this.props.submenu
      })}
        onMouseLeave={this.props.closeMenu}
      >
        
      <Hyperlink content={this.props.title} destination={this.props.destination} />
      
      </div>
    );
  }
}

NavItem.defaultProps = {
  title: "Nav Item",
  destination: "http://google.com"
}
