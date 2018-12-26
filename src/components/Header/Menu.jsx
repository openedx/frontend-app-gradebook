import React from 'react';
import classNames from 'classnames';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  // Expose this method for parent components as recommended by Facebook
  // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Managing-Focus.md
  focus(index) {
    let focusableElements = this.refs.menu.querySelectorAll('a, button');
    if (focusableElements.length == 0) return;

    if (index === 0) {
      focusableElements[0].focus();
    } else {
      focusableElements[focusableElements.length - 1].focus();
    }
  }

  open() {
    this.props.open(this.props.name);
  }

  close() {
    this.props.close(this.props.name);
  }

  onKeyDown(event) {
    if (!this.props.expanded) return;

    switch(event.key) {
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.props.focusMenuTrigger();
        this.close();
        break;
      case 'Enter':
        if (event.target == this.refs.closeButton) {
          event.preventDefault();
          this.props.focusMenuTrigger();
          this.close();
        }
        break;
      case 'Tab':

        // Trap focus when expanded
        if (this.props.expanded) {

          let focusableElements = this.refs.menu.querySelectorAll('a, button');

          // Cycle from last to first
          if (document.activeElement === focusableElements[focusableElements.length - 1] && !event.shiftKey) {
            event.preventDefault();
            // this.props.triggerElement ? this.props.triggerElement.focus() : focusableElements[0].focus();
            this.props.focusMenuTrigger();
          }


          // Cycle from first to trigger or last item
          if (document.activeElement === focusableElements[0] && event.shiftKey) {
            event.preventDefault();
            // this.props.triggerElement ? this.props.triggerElement.focus() : focusableElements[focusableElements.length - 1].focus();
            this.props.focusMenuTrigger();
            
          }
        } 
        
        break;

    }
  }

  onMouseEnter(e) {
    this.open();
  }

  onMouseLeave(e) {
    this.close();
  }

  render() {
    if (!this.props.expanded) return false;

    return (
      <div 
        className={this.props.className}
        ref="menu"
        onKeyDown={this.onKeyDown}
        onMouseEnter={this.props.triggerOnHover ? this.onMouseEnter : null}
        onMouseLeave={this.props.triggerOnHover ? this.onMouseLeave : null}
      >
        {this.props.hasCloseButton ? (
          <button 
            onClick={this.close}
            ref="closeButton"
          >{this.props.closeButtonText}</button>
        ) : null}
        {this.props.children}
        
      </div>
    );
  }
}