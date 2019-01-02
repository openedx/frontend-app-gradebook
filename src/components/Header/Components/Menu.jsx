import React from 'react';
import classNames from 'classnames';
import { Hyperlink, Button } from '@edx/paragon';
import { CSSTransition } from 'react-transition-group';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: this.props.expanded || false
    }

    this.onTriggerClick = this.onTriggerClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }


  // Lifecycle Events

  componentDidMount() {
    // document.addEventListener('click', this.onDocumentClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, true);

    // Call onClose callback when unmounting and open
    if (this.state.expanded) {
      this.props.onClose && this.props.onClose();
    }
  }


  // Internal functions

  open() {
    this.props.onOpen && this.props.onOpen();

    this.setState({
      expanded: true
    });

    document.addEventListener('click', this.onDocumentClick, true);
  }

  close() {
    this.props.onClose && this.props.onClose();

    this.setState({
      expanded: false
    });

    document.addEventListener('click', this.onDocumentClick, true);
  }

  toggle() {
    this.state.expanded ? this.close() : this.open();
  }

  getFocusableElements() {
    return this.refs.menu.querySelectorAll('button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])');
  }


  // Event handlers

  onDocumentClick(e) {
    if (this.props.ignoreDocumentClicks) return;
    if (this.refs.menu && (e.target === this.refs.menu || this.refs.menu.contains(e.target))) return;

    this.close();
  }

  onTriggerClick(e) {
    if (this.state.expanded && this.props.triggerDestination) {
      return; // do nothing. let the browser follow the link
    }

    e.preventDefault();

    this.toggle();
  }

  onCloseClick(e) {
    this.getFocusableElements()[0].focus();
    this.close();
  }

  onKeyDown(e) {
    if (!this.state.expanded) return;
    switch(e.key) {
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        
        this.getFocusableElements()[0].focus();
        this.close();
        break;
      case 'Enter':
        // Using focusable elements instead of a ref to the trigger
        // because Hyperlink and Button can handle refs as functional compoenents
        if (document.activeElement == this.getFocusableElements()[0]) {
          e.preventDefault();
          this.toggle();
        }
        break;
      case 'Tab':
        // Trap focus
        const focusableElements = Array.from(this.getFocusableElements());
        const indexOfActiveElement = focusableElements.indexOf(document.activeElement);

        if (indexOfActiveElement === focusableElements.length - 1 && !e.shiftKey) { // last. cycle forward
          e.preventDefault();
          focusableElements[0].focus();
        }

        if (indexOfActiveElement === 0 && e.shiftKey) { // first. cycle backward
          e.preventDefault();
          focusableElements[focusableElements.length - 1].focus();          
        }
        break;
    }
  }

  onMouseEnter(e) {
    if (!this.props.respondToPointerEvents) return;

    this.open();
  }

  onMouseLeave(e) {
    if (!this.props.respondToPointerEvents) return;

    this.close();
  }




  render() {
    const triggerContent = this.state.expanded && this.props.triggerExpandedContent ? 
      this.props.triggerExpandedContent : 
      this.props.triggerContent;
    
    const triggerProps = {
      className: classNames("menu-trigger", {
        expanded: this.state.expanded
      }, this.props.triggerClassName),
      onClick: this.onTriggerClick,
    }

    const hyperlinkTriggerProps = {
      content: triggerContent,
      destination: this.props.triggerDestination,
    }

    return (
      <div 
        className={classNames("menu", this.props.className, {
          expanded: this.state.expanded
        })}
        ref="menu"
        onKeyDown={this.onKeyDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {
          this.props.triggerDestination ? 
          <Hyperlink {...hyperlinkTriggerProps} {...triggerProps} /> :
          <button type="button" {...triggerProps}>{triggerContent}</button>
        }

        <CSSTransition
          in={this.state.expanded}
          timeout={this.props.transitionTimeout || 0}
          classNames={this.props.transitionClassName || "menu-content"}
          unmountOnExit
          onExited={() => {
            this.setState({
              showValidationButton: true,
            });
          }}
        >
          <div className="menu-content">
            {this.props.closeButton ? React.cloneElement(this.props.closeButton, {
              onClick: this.onCloseClick
            }): null}
            <div className="menu-content-container">
              {this.props.children}
            </div>
          </div>
        </CSSTransition>
      </div>
    )
  }
}