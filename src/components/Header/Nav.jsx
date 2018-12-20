import React from 'react';
import classNames from 'classnames';


export default class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav 
        className="edx-nav"
        aria-label={this.props.ariaLabel}
      >
        {this.props.children}
      </nav>
    );
  }
}

Nav.defaultProps = {
  ariaLabel: "Main Navigation"
}
