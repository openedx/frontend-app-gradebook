import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { TransitionGroup } from 'react-transition-group';

import MenuTrigger from './MenuTrigger';
import Menu from './Menu';


import { Hyperlink } from '@edx/paragon';

export default class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedMenu: null,
      freezeMenu: false
    }

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    this.focusMenuTrigger = this.focusMenuTrigger.bind(this);
    this.focusMenuItem = this.focusMenuItem.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.freezeTimeout);
  }

  // Provides control over leaving
  freezeMenu(timeMS) {
    clearTimeout(this.freezeTimeout);
    this.setState({
      freezeMenu: true
    });

    this.freezeTimeout = setTimeout(this.unfreezeMenu.bind(this), timeMS);
  }
  unfreezeMenu() {
    this.setState({
      freezeMenu: false
    });    
  }


  openMenu(name) {
    clearTimeout(this.closeMenuTimeout);

    this.setState({
      expandedMenu: name
    });
  }

  closeMenu(name) {
    const close = () => {
      this.setState({
        expandedMenu: null
      });
    };

    if (this.state.expandedMenu === name) {
      if (this.props.menuType === "touch") {
        close();
        // this.freezeMenu(500);
      } else {
        this.closeMenuTimeout = setTimeout(close, 5); // work on this later. 
        // this.freezeMenu(0);
      }
    }
  }

  focusMenuTrigger() {
    this.refs.expandedMenuTrigger.focus();
  }

  focusMenuItem(itemIndex) {
    this.refs.expandedMenu.focus(itemIndex);
  }

  render() {
    return (
      <nav className={classNames("main-nav", {
        "has-expanded-menu": this.state.expandedMenu !== null,
        "touch-nav": this.props.menuType === "touch",
        "pointer-nav": this.props.menuType === "pointer"
      })}>
        <div className="main-nav-wrap">
          <div className="top-level">
            {this.renderTopLevelItems()}
          </div>

          <div className="submenu">
            {this.props.menuItems.map((item, index) => {
              if (!item.submenu) return; // Submenus only
              return (
                <Menu 
                  name={item.submenu.name}
                  key={"menu-" + item.submenu.name}
                  expanded={this.state.expandedMenu == item.submenu.name} // Handled by transition
                  open={this.openMenu}
                  close={this.closeMenu}
                  ref={this.state.expandedMenu == item.submenu.name ? "expandedMenu" : null}
                  focusMenuTrigger={this.focusMenuTrigger}
                  triggerElement={this.state.menuTrigger}
                  triggerOnHover={this.props.menuType === "pointer"}
                >{item.submenu.content}</Menu>
              )
            })}
          </div>
        </div>
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
            focusMenuItem={this.refs.expandedMenu ? this.focusMenuItem : null}
            triggerOpen={this.openMenu}
            triggerClose={this.closeMenu}
            triggerOnHover={this.props.menuType === "pointer"}
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
}


class ComponentFreezer extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.freeze) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return this.props.children;
  }
}




