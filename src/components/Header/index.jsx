import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import MainNav from './MainNav';

import EdxLogo from '../../../assets/edx-sm.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      openMenu: "MAIN_NAV"
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
      <div className="header-menu">
        <MainNav 
          menuType="pointer" // "pointer", "touch"
          menuItems={[
            {
              content: "Courses",
              destination: "#",
              submenu: {
                name: "Courses",
                content: (
                  <div>
                    <h4>Courses by Subject</h4>
                    <Hyperlink content="Computer Science" destination="#" />
                    <Hyperlink content="Language" destination="#" />
                    <Hyperlink content="Data & Statistics" destination="#" />
                    <Hyperlink content="Business & Management" destination="#" />
                    <Hyperlink content="Engineering" destination="#" />
                    <Hyperlink content="Humanities" destination="#" />
                    <Hyperlink content="View all courses by subjects" destination="#" />
                  </div>
                )
              }
            },
            {
              content: "Programs",
              destination: "#",
              submenu: {
                name: "Programs",
                content: (
                  <div>
                    <h4>Programs & Degrees</h4>
                    <Hyperlink content="MicroMasters Program" destination="#" />
                    <Hyperlink content="Professional Certificate" destination="#" />
                    <Hyperlink content="Online Master's Degree" destination="#" />
                    <Hyperlink content="Global Freshman Academy" destination="#" />
                    <Hyperlink content="XSeries" destination="#" />
                  </div>
                )
              }
            },
            {
              content: "Schools & Partners",
              destination: "#"
            },
            {
              content: "edX for Business",
              destination: "#"
            }
          ]}
        />
      </div>
    )
  }

  renderSearchMenu() {
    return (
      <div className="header-menu">
        Search Menu
      </div>
    )
  }

  renderAccountMenu() {
    return (
      <div className="header-menu">
        Account Menu
      </div>
    )
  }
}
