import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { Hyperlink } from '@edx/paragon';

export default class NavMenu extends React.Component {
  constructor(props) {
    super(props);


    this.onKeyDown = this.onKeyDown.bind(this);
    
    this.focusTrigger = this.focusTrigger.bind(this);

    this.onTriggerClick = this.onTriggerClick.bind(this);
  }

  onTriggerClick(e) {
    e.preventDefault();
    
    if (this.props.expanded) {
      this.props.close();
    } else {
      this.props.open();
    }
  }

  onKeyDown(event) {
    switch(event.key) {
      case 'Escape': // ESC
        this.props.close();
        this.focusTrigger();
      case 'Enter':
        break;
      case 'Tab':

        // Trap focus when expanded
        if (this.props.expanded) {

          let focusableElements = this.refs.menuContent.querySelectorAll('a, button');

          // Cycle from last to first
          if (document.activeElement === focusableElements[focusableElements.length - 1] && !event.shiftKey) {
            event.preventDefault();
            this.focusTrigger();
          }


          // Cycle from first to last
          if (document.activeElement === this.refs.menu.querySelectorAll('a, button')[0] && event.shiftKey) {
            event.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
          }
        } 
        
        break;

    }
  }

  focusTrigger() {
    this.refs.menu.querySelectorAll('a, button')[0].focus();
  }

  render() {
    return (
      <div 
        className={classNames("nav-menu", {"expanded": this.props.expanded})}
        onMouseLeave={this.props.usePointerEvents ? this.props.close : null}
        onMouseEnter={this.props.usePointerEvents ? this.props.open : null}
        ref="menu"
        onKeyDown={this.onKeyDown}
      >
        <Hyperlink
          content={this.props.title} 
          destination={this.props.destination}
          onClick={this.onTriggerClick}
        />

        <CSSTransition
          in={this.props.expanded}
          timeout={500}
          classNames="menu"
          unmountOnExit
          onExited={null}
        >
          <div 
            className="nav-menu-content"
            ref="menuContent"
          >
            {this.props.children}
          </div>
        </CSSTransition>    
        

      </div>
    );
  }
}

NavMenu.defaultProps = {
  title: "Nav Menu",
  destination: "http://google.com"
}
