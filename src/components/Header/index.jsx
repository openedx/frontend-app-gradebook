import React from 'react';
import classNames from 'classnames';
import { Hyperlink, SearchField } from '@edx/paragon';
import MainNav from './MainNav';

import Menu from './Menu';
import MenuTrigger from './MenuTrigger';

import EdxLogo from '../../../assets/edx-sm.png';


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faTimes, faSearch);


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
      usePointerEvents: false,
      focusMenuItem: this.focusMenuItem
    }

    const commonMenuProps = {
      open: this.openMenu,
      close: this.closeMenu,
      usePointerEvents: false,
      focusMenuTrigger: this.focusMenuTrigger
    }

    // Responsive stuff is finicky right now, will change this toggle later.
    const navType = "mobile";

    return (
      <header className="site-header mobile">

        <div className="primary-menu">
          {this.renderTrigger("main", <FontAwesomeIcon icon={this.state.expandedMenu === "main" ? "times" : "bars"} />, commonTriggerProps)}
          {this.renderMenu("main", (
            <MainNav 
              menuType="touch" // "pointer", "touch"
              menuItems={MENU_ITEMS}
            />
          ), commonMenuProps)}
        </div>

        <div className="header-logo-container">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="secondary-menu">
          {this.renderTrigger("search", <FontAwesomeIcon icon={"search"} />, commonTriggerProps)}
          {this.renderMenu("search", (
            <div>
              <div className="menu-text">
                  <SearchField onSubmit={(value) => { console.log(value); }} />
              </div>

            </div>
          ), commonMenuProps)}

          {this.renderTrigger("account", "Acct", commonTriggerProps)}
          {this.renderMenu("account", (
            <div>
                <div className="menu-text">
                  <p>[IMG] %username%</p>
                </div>

                <button>Resume My Last Course (button)</button>
              
                <Hyperlink content="My Dashboard" destination="#" />
                <Hyperlink content="My Courses" destination="#" />
                <Hyperlink content="My Programs" destination="#" />
                <Hyperlink content="Help" destination="#" />
                <Hyperlink content="My Profile" destination="#" />
                <Hyperlink content="Account Settings" destination="#" />
                <Hyperlink content="Sign Out" destination="#" />
              

            </div>
          ), commonMenuProps)}
        </div>
      </header>
    );
  }

  renderMobileNav() {

  }

  renderDesktopNav() {

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
  renderMenu(menuName, content, commonMenuProps, forceExpand) {
    return (
      <Menu 
        name={menuName}
        className={classNames("menu", "header-menu", menuName + "-menu")}
        expanded={forceExpand || this.state.expandedMenu == menuName}
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
    content: "Courses by subject",
    destination: "#",
    submenu: {
      name: "Courses",
      closeButtonText: "Back to main navigation",
      content: (
        <div>
          <div className="menu-text">
            <h4>Courses by subject</h4>
          </div>
          <Hyperlink className="nav-item" content="Computer Science" destination="#" />
          <Hyperlink className="nav-item" content="Language" destination="#" />
          <Hyperlink className="nav-item" content="Data & Statistics" destination="#" />
          <Hyperlink className="nav-item" content="Business & Management" destination="#" />
          <Hyperlink className="nav-item" content="Engineering" destination="#" />
          <Hyperlink className="nav-item" content="Humanities" destination="#" />
          <Hyperlink className="nav-item" content="View all courses by subject" destination="#" />
        </div>
      )
    }
  },
  {
    content: "Programs & degrees",
    destination: "#",
    submenu: {
      name: "Programs",
      closeButtonText: "Back to main navigation",
      content: (
        <div>
          <div className="menu-text">
            <h4>Programs & degrees</h4>
            <p style={{marginBottom:0}}><Hyperlink content="MicroMasters Program" destination="#" /></p>
            <p>Graduate-level, for career advancement or a degree path</p>

            <p style={{marginBottom:0}}><Hyperlink content="Professional Certificate" destination="#" /></p>
            <p>From employers or universities to build today's in-demand skills</p>

            <p style={{marginBottom:0}}><Hyperlink content="Online Master's Degree" destination="#" /></p>
            <p>Top-ranked programs, affordable, and fully online</p>

            <p style={{marginBottom:0}}><Hyperlink content="Global Freshman Academy" destination="#" /></p>
            <p>Freshman year courses for university credit from ASU</p>

            <p style={{marginBottom:0}}><Hyperlink content="XSeries" destination="#" /></p>
            <p>Series of courses for a deep understanding of a topic</p>
          </div>
        </div>
      )
    }
  },
  {
    content: "Schools & partners",
    destination: "#"
  },
  {
    content: "edX for Business",
    destination: "#"
  }
]
