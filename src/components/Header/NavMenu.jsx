import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { Hyperlink } from '@edx/paragon';

export default class NavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyUp = this.onKeyUp.bind(this);
    this.focusTrigger = this.focusTrigger.bind(this);
  }

  onKeyUp(event) {
    switch(event.keyCode) {
      case 27: // ESC
        this.focusTrigger();
        this.props.closeMenu();
        break;
    }
  }

  focusTrigger() {
    this.refs.triggerButton.focus();
  }

  render() {
    return (
      <div 
        className={classNames("nav-menu", {"open": this.props.isActive})}
        aria-expanded={this.props.isActive}
        onMouseLeave={/*this.props.closeMenu*/ null}
        onMouseEnter={/*this.props.openMenu*/ null}
        onKeyUp={this.onKeyUp}
      >
        <button 
          onClick={this.props.openMenu}
          ref="triggerButton"
        >
          {this.props.title}
        </button>

          {this.props.isActive ? (
            <div className="submenu">
              <button 
                className="mobile-only"
                ref="closeButton"
                onKeyUp={(e) => {
                  if (e.keyCode == 13) { //ENTER
                    this.focusTrigger();
                    this.props.closeMenu();
                  }
                }}
                onClick={(e) => {
                  this.props.closeMenu();
                }}
                /*
                  Note when triggered with ENTER closing the menu this way will not refocus the trigger button.
                  Should fix.
                */
              >Go back</button>
              {this.props.children}
            </div>

          ):null}
          

      </div>
    );
  }
}

NavMenu.defaultProps = {
  title: "Nav Menu",
  destination: "http://google.com"
}
