import React from 'react';
import classNames from 'classnames';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, true);
  }

  getFocusableElements() {
    return this.refs.menu.querySelectorAll('button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])');
  }
  // Expose this method for parent components as recommended by Facebook
  // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Managing-Focus.md
  focus(index) {
    let focusableElements = this.getFocusableElements();
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

          this.props.focusMenuTrigger();
          this.close();
        }
        break;
      case 'Tab':

        // Trap focus when expanded
        if (this.props.expanded) {

          const focusableElements = Array.from(this.getFocusableElements());          
          const indexOfActiveElement = focusableElements.indexOf(document.activeElement);

          if (indexOfActiveElement === focusableElements.length - 1 && !event.shiftKey) { // last. cycle forward
            event.preventDefault();
            this.props.focusMenuTrigger();
          }

          if (indexOfActiveElement === 0 && event.shiftKey) { // first. cycle backward
            event.preventDefault();
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

  onDocumentClick(e) {
    if (this.refs.menu && (e.target === this.refs.menu || this.refs.menu.contains(e.target))) return;

    // this.close(); // right now this causes a bug when you click close on the trigger (does a double click essentially)
  }

  render() {
    if (!this.props.expanded) return null;

    return (
      <div 
        className={this.props.className}
        ref="menu"
        onKeyDown={this.onKeyDown}
        onMouseEnter={this.props.usePointerEvents ? this.onMouseEnter : null}
        onMouseLeave={this.props.usePointerEvents ? this.onMouseLeave : null}
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