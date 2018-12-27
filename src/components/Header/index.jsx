import React from 'react';
import classNames from 'classnames';
import { 
  Hyperlink, 
  SearchField,
  breakpoints, ExtraSmall, Small, Medium, Large, ExtraLarge, LargerThanExtraSmall
} from '@edx/paragon';
import MainNav from './MainNav';

import Menu from './Menu';
import MenuTrigger from './MenuTrigger';

import EdxLogo from '../../../assets/edx-sm.png';


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faTimes, faSearch, faChevronLeft, faChevronRight);


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
    return (
      <div>
        <ExtraSmall>{this.renderMobileNav()}</ExtraSmall>
        <Small>{this.renderMobileNav()}</Small>
        <Medium>{this.renderDesktopNav()}</Medium>
        <Large>{this.renderDesktopNav()}</Large>
        <ExtraLarge>{this.renderDesktopNav()}</ExtraLarge>
      </div>
    );
  }

  renderMobileNav() {
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

    return (
      <header className="site-header mobile">

        <div className="primary-menu">
          {this.renderTrigger({
            menuName: "main", 
            content: (<FontAwesomeIcon icon={this.state.expandedMenu === "main" ? "times" : "bars"} />),
            className: "menu-button primary-menu-button"
          }, commonTriggerProps)}
          {this.renderMenu("main", (
            <MainNav 
              usePointerEvents={commonMenuProps.usePointerEvents}
              menuItems={MENU_ITEMS}
            />
          ), commonMenuProps)}
        </div>

        <div className="header-logo-container">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="secondary-menu">
          {this.renderTrigger({
            menuName: "search", 
            content: (<FontAwesomeIcon icon={"search"} />),
            className: "menu-button"
          }, commonTriggerProps)}

          {this.renderMenu("search", (
            <div>
              <div className="menu-text">
                  <SearchField onSubmit={(value) => { console.log(value); }} />
              </div>

            </div>
          ), commonMenuProps)}

          {this.renderTrigger({
            menuName: "account", 
            content: "Account",
            className: "menu-button"
          }, commonTriggerProps)}
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

  renderDesktopNav() {
    const commonTriggerProps = {
      triggerOpen: this.openMenu,
      triggerClose: this.closeMenu,
      usePointerEvents: true,
      focusMenuItem: this.focusMenuItem
    }

    const commonMenuProps = {
      open: this.openMenu,
      close: this.closeMenu,
      usePointerEvents: true,
      focusMenuTrigger: this.focusMenuTrigger
    }

    return (
      <header className="site-header desktop">

        <Hyperlink 
          className="header-logo" 
          content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} 
          destination="https://www.edx.org" 
        />
        
        <div className="primary-menu">
          <MainNav 
            usePointerEvents={commonMenuProps.usePointerEvents}
            menuItems={MENU_ITEMS}
          />
        </div>


        <div className="secondary-menu">
          <SearchField onSubmit={(value) => { console.log(value); }} />
          
          {
              this.renderTrigger({
                  menuName: "account", 
                  content: "My Account",
                  className: "nav-item"
                }, 
                commonTriggerProps
              )
          }

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

  renderTrigger(props, commonTriggerProps) {
    return (
      <MenuTrigger
        ref={this.state.expandedMenu === props.menuName ? "expandedMenuTrigger" : null}
        expanded={this.state.expandedMenu === props.menuName}
        {...props}
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
          <ul>
            <li><Hyperlink content="Computer Science" destination="#" /></li>
            <li><Hyperlink content="Language" destination="#" /></li>
            <li><Hyperlink content="Data & Statistics" destination="#" /></li>
            <li><Hyperlink content="Business & Management" destination="#" /></li>
            <li><Hyperlink content="Engineering" destination="#" /></li>
            <li><Hyperlink content="Humanities" destination="#" /></li>
            <li><Hyperlink content="View all courses by subject" destination="#" /></li>
          </ul>
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
          <ul>
            <li>
              <Hyperlink content="MicroMasters Program" destination="#" />
              <p>Graduate-level, for career advancement or a degree path</p>
            </li>

            <li>
              <Hyperlink content="Professional Certificate" destination="#" />
              <p>From employers or universities to build today's in-demand skills</p>
            </li>

            <li>
              <Hyperlink content="Online Master's Degree" destination="#" />
              <p>Top-ranked programs, affordable, and fully online</p>
            </li>

            <li>
              <Hyperlink content="Global Freshman Academy" destination="#" />
              <p>Freshman year courses for university credit from ASU</p>
            </li>

            <li>
              <Hyperlink content="XSeries" destination="#" />
              <p>Series of courses for a deep understanding of a topic</p>
            </li>
          </ul>
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
