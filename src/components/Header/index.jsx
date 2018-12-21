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
      openMenu: null
    };
  }

  onMenuTriggerClick(targetName, e) {
    console.log(targetName, this.state.openMenu)
    if (targetName == this.state.openMenu) {
      this.setState({openMenu: null});
    } else {
      this.setState({openMenu: targetName});
    }
  }

  render() {
    return (
      <header className="site-header">

        <div className="left-menu">
          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "MAIN_NAV")}>Hamburger</button>
          {this.state.openMenu == "MAIN_NAV" ? this.renderMainMenu() : null}
        </div>

        <div className="site-header-logo">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="right-menu">
          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "SEARCH")}>Search</button>
          {this.state.openMenu == "SEARCH" ? this.renderSearchMenu() : null}

          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "ACCOUNT")}>Search</button>
          {this.state.openMenu == "ACCOUNT" ? this.renderAccountMenu() : null}
        </div>
      </header>
    );
  }

  renderMainMenu() {
    return (
      <div className="menu">
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
      </div>
    )
  }

  renderSearchMenu() {
    return (
      <div className="menu">
        Search Menu
      </div>
    )
  }

  renderAccountMenu() {
    return (
      <div className="menu">
        Account Menu
      </div>
    )
  }
}
