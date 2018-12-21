import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import Nav from './Nav';
import NavMenu from './NavMenu';
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
          <NavMenu title="Courses">
            <h4>Courses by Subject</h4>
            <NavItem title="Computer Science" />
            <NavItem title="Language" />
            <NavItem title="Data & Statistics" />
            <NavItem title="Business & Management" />
            <NavItem title="Engineering" />
            <NavItem title="Humanities" />
            <NavItem title="View all courses by subjects" />
          </NavMenu>

          <NavMenu title="Programs & Degrees">
            <h4>Programs & Degrees</h4>
            <NavItem title="MicroMasters Program" />
            <NavItem title="Professional Certificate" />
            <NavItem title="Online Master's Degree" />
            <NavItem title="Global Freshman Academy" />
            <NavItem title="XSeries" />
          </NavMenu>

          <NavItem title="Schools & Partners" />
          <NavItem title="edX for Business" />
        </Nav>
        
        <Hyperlink content={this.renderLogo()} destination="https://www.edx.org" />
        
        {/* <SearchBar /> */}

        {/* <Nav><AccountMenu /></Nav> */}

      </header>
    );
  }
}
