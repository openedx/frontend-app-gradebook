import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { TransitionGroup } from 'react-transition-group';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import { Hyperlink } from '@edx/paragon';

export default class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedMenu: null,
      submenuTrayIsOpen: false
    }

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
    const close = () => {
      this.setState({
        expandedMenu: null,
        submenuTrayIsOpen: false
      });
    };

    if (this.state.expandedMenu === name) {
      if (!this.props.usePointerEvents) {
        // Starts the closing of the tray while leaving the menu active (until animation completes)
        this.setState({
          submenuTrayIsOpen: false
        });
        this.closeMenuTimeout = setTimeout(close, 500);
      } else {
        close();
      }
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
      <nav className={classNames("main-nav", {
        "has-expanded-menu": this.state.expandedMenu !== null,
        "open-submenu-tray": this.state.submenuTrayIsOpen,
        "touch-nav": !this.props.usePointerEvents,
        "pointer-nav": this.props.usePointerEvents
      })}>
      
        {this.renderTopLevelItems()}

        <CSSTransition
          in={Boolean(this.state.expandedMenu)}
          timeout={500}
          classNames="fade"
        >
          <div className="submenu">
            {this.renderMenus()}
          </div>
        </CSSTransition>
      </nav>
    );
  }

  renderTopLevelItems() {
    return this.props.menuItems.map((item, index) => {
      if (item.submenu) {
        return (
          <MenuTrigger
            className="nav-item"
            key={"nav-item-" + index}
            ref={this.state.expandedMenu === item.submenu.name ? "expandedMenuTrigger" : null}
            content={item.content}
            destination={item.destination}
            menuName={item.submenu.name}
            expanded={this.state.expandedMenu === item.submenu.name}
            focusMenuItem={this.focusMenuItem}
            triggerOpen={this.openMenu}
            triggerClose={this.closeMenu}
            usePointerEvents={this.props.usePointerEvents}
          />
        )
      } else {
        return (
          <Hyperlink 
            className="nav-item" 
            key={"nav-item-" + index}
            content={item.content}
            destination={item.destination}
          />
        )
      }
    })
  }

  renderMenus() {
    return this.props.menuItems.map((item, index) => {
      if (!item.submenu) return; // Submenus only
      return (
        <Menu 
          name={item.submenu.name}
          className="menu"
          key={"menu-" + item.submenu.name}
          expanded={this.state.expandedMenu == item.submenu.name}
          open={this.openMenu}
          close={this.closeMenu}
          ref={this.state.expandedMenu == item.submenu.name ? "expandedMenu" : null}
          focusMenuTrigger={this.focusMenuTrigger}
          usePointerEvents={this.props.usePointerEvents}
          hasCloseButton={!this.props.usePointerEvents}
          closeButtonText={item.submenu.closeButtonText}
        >{item.submenu.content}</Menu>
      )
    })
  }
}
