import React from 'react';
import classNames from 'classnames';

import { Hyperlink } from '@edx/paragon';


export default class NavItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classNames('nav-item')}>
        <Hyperlink content={this.props.title} destination={this.props.destination} />
      </div>
    );
  }
}

NavItem.defaultProps = {
  title: "Nav Item",
  destination: "http://google.com"
}
