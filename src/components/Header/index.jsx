import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import MainNav from './MainNav';

import Menu from './Menu';
import MenuTrigger from './MenuTrigger';

import EdxLogo from '../../../assets/edx-sm.png';


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faTimes)


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedMenu: null,
      submenuTrayIsOpen: false
    };


    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.focusMenuTrigger = this.focusMenuTrigger.bind(this);
    this.focusMenuItem = this.focusMenuItem.bind(this);
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
    const commonTriggerProps = {
      triggerOpen: this.openMenu,
      triggerClose: this.closeMenu,
      triggerOnHover: false,
      focusMenuItem: this.focusMenuItem
    }

    const commonMenuProps = {
      open: this.openMenu,
      close: this.closeMenu,
      triggerOnHover: false,
      focusMenuTrigger: this.focusMenuTrigger
    }

    return (
      <header className="site-header">

        <div className="left-menu">
          {this.renderTrigger("main", <FontAwesomeIcon icon={this.state.expandedMenu === "main" ? "times" : "bars"} />, commonTriggerProps)}
          {this.renderMenu("main", (
            <MainNav 
              menuType="touch" // "pointer", "touch"
              menuItems={MENU_ITEMS}
            />
          ), commonMenuProps)}
        </div>

        <div className="site-header-logo">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="right-menu">
          {this.renderTrigger("search", "Search", commonTriggerProps)}
          {this.renderMenu("search", (
            <div>
              Search
            </div>
          ), commonMenuProps)}

          {this.renderTrigger("account", "Account", commonTriggerProps)}
          {this.renderMenu("account", (
            <div>
              ACCOUNT
            </div>
          ), commonMenuProps)}
        </div>
      </header>
    );
  }

  renderTrigger(menuName, content, commonTriggerProps) {
    return (
      <MenuTrigger
        className="menu-button"
        ref={this.state.expandedMenu === menuName ? "expandedMenuTrigger" : null}
        content={content}
        menuName={menuName}
        expanded={this.state.expandedMenu === menuName}
        {...commonTriggerProps}
      />
    );
  }
  renderMenu(menuName, content, commonMenuProps) {
    return (
      <Menu 
        name={menuName}
        className="menu header-menu"
        expanded={this.state.expandedMenu == menuName}
        ref={this.state.expandedMenu == menuName ? "expandedMenu" : null}
        {...commonMenuProps}
      >
        {content}
      </Menu>
    );
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
