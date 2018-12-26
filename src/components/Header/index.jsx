import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import MainNav from './MainNav';

import Menu from './Menu';
import MenuTrigger from './MenuTrigger';

import EdxLogo from '../../../assets/edx-sm.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      openMenu: "MAIN_NAV",
      expandedMenu: 'main',
      submenuTrayIsOpen: true
    };


    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.focusMenuTrigger = this.focusMenuTrigger.bind(this);
    this.focusMenuItem = this.focusMenuItem.bind(this);
  }

  onMenuTriggerClick(targetName, e) {
    console.log(targetName, this.state.openMenu)
    if (targetName == this.state.openMenu) {
      this.setState({openMenu: null});
    } else {
      this.setState({openMenu: targetName});
    }
  }

  openMenu(name) {
    clearTimeout(this.closeMenuTimeout);

    this.setState({
      expandedMenu: name,
      submenuTrayIsOpen: true
    });
  }

  closeMenu(name) {
    if (this.state.expandedMenu === name) {
      this.setState({
        expandedMenu: null,
        submenuTrayIsOpen: false
      });
    }
  }

  focusMenuTrigger() {
    this.refs.expandedMenuTrigger && this.refs.expandedMenuTrigger.focus();
  }

  focusMenuItem(itemIndex) {
    this.refs.expandedMenu && this.refs.expandedMenu.focus(itemIndex);
  }


  render() {
    return (
      <header className="site-header">

        <div className="left-menu">
          <MenuTrigger
            className="menu-button"
            ref={this.state.expandedMenu === "main" ? "expandedMenuTrigger" : null}
            content={"Hamburger"}
            menuName={"main"}
            expanded={this.state.expandedMenu === "main"}
            focusMenuItem={this.focusMenuItem}
            triggerOpen={this.openMenu}
            triggerClose={this.closeMenu}
            triggerOnHover={false}
          />
          {this.renderMainMenu()}

        </div>

        <div className="site-header-logo">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="right-menu">
          <MenuTrigger
            className="menu-button"
            ref={this.state.expandedMenu === "search" ? "expandedMenuTrigger" : null}
            content={"Search"}
            menuName={"search"}
            expanded={this.state.expandedMenu === "search"}
            focusMenuItem={this.focusMenuItem}
            triggerOpen={this.openMenu}
            triggerClose={this.closeMenu}
            triggerOnHover={false}
          />

          <Menu 
            name="search"
            className="menu header-menu"
            key={"search-menu"}
            expanded={this.state.expandedMenu == "search"}
            open={this.openMenu}
            close={this.closeMenu}
            ref={this.state.expandedMenu == "search" ? "expandedMenu" : null}
            focusMenuTrigger={this.focusMenuTrigger}
            triggerOnHover={false}
          >
            SEARCH
          </Menu>


          <MenuTrigger
            className="menu-button"
            ref={this.state.expandedMenu === "account" ? "expandedMenuTrigger" : null}
            content={"account"}
            menuName={"account"}
            expanded={this.state.expandedMenu === "account"}
            focusMenuItem={this.focusMenuItem}
            triggerOpen={this.openMenu}
            triggerClose={this.closeMenu}
            triggerOnHover={false}
          />

          <Menu 
            name="account"
            className="menu header-menu"
            key={"account-menu"}
            expanded={this.state.expandedMenu == "account"}
            open={this.openMenu}
            close={this.closeMenu}
            ref={this.state.expandedMenu == "account" ? "expandedMenu" : null}
            focusMenuTrigger={this.focusMenuTrigger}
            triggerOnHover={false}
          >
            ACCOUNT
          </Menu>

        </div>
      </header>
    );
  }

  renderMainMenu() {
    return (
      <Menu 
        name="main"
        className="menu header-menu"
        key={"main-menu"}
        expanded={this.state.expandedMenu == "main"}
        open={this.openMenu}
        close={this.closeMenu}
        ref={this.state.expandedMenu == "main" ? "expandedMenu" : null}
        focusMenuTrigger={this.focusMenuTrigger}
        triggerOnHover={false}
      >
        <MainNav 
          menuType="touch" // "pointer", "touch"
          menuItems={MENU_ITEMS}
        />
      </Menu>
        
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


const MENU_ITEMS = [
  {
    content: "Courses",
    destination: "#",
    submenu: {
      name: "Courses",
      closeButtonText: "Back to main navigation",
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
      closeButtonText: "Back to main navigation",
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
]
