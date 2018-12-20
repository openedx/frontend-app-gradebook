import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import Nav from './Nav';
import NavItem from './NavItem';

import EdxLogo from '../../../assets/edx-sm.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
    };
  }

  renderLogo() {
    return (
      <img src={EdxLogo} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    return (
      <header className="site-header">
        <Nav>
          <NavItem
            submenu={[
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />
            ]}
          />
          <NavItem
            submenu={[
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />,
              <NavItem />
            ]}
          />
          <NavItem />
          <NavItem />
        </Nav>
        
        <Hyperlink content={this.renderLogo()} destination="https://www.edx.org" />
        
        {/* <SearchBar /> */}

        {/* <Nav><AccountMenu /></Nav> */}

      </header>
    );
  }
}
