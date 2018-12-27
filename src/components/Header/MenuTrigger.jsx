import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';

export default class MenuTrigger extends React.Component {
  constructor(props) {
    super(props);

    this.triggerOpen = this.props.triggerOpen && this.props.triggerOpen.bind(null, this.props.menuName);
    this.triggerClose = this.props.triggerClose && this.props.triggerClose.bind(null, this.props.menuName);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  // Expose this method for parent components as recommended by Facebook
  // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Managing-Focus.md
  focus() {
    const thisElement = ReactDOM.findDOMNode(this);
    thisElement.focus();
  }

  onKeyDown(e) {
    if (!this.props.expanded) return;
    
    switch(e.key) {
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        this.focus();
        this.triggerClose();
        break;
      case 'Tab':
        e.preventDefault();

        if (e.shiftKey) {
          this.props.focusMenuItem && this.props.focusMenuItem(-1);
        } else {
          this.props.focusMenuItem && this.props.focusMenuItem(0);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (this.props.expanded) {
          this.triggerClose();
        } else {
          this.triggerOpen();
        }
        break;
    }
  }

  onClick(e) {
    if (!this.props.expanded) {
      e.preventDefault();
      this.triggerOpen();
    } else if (!this.props.destination) {
      e.preventDefault();
      this.triggerClose();
    } else {
      // Else follow the link like normal
    }
  }

  render() {
    const props = {
      className: classNames(this.props.className, {
        expanded: this.props.expanded
      }),
      content: this.props.content,
      destination: this.props.destination,
      onClick: this.onClick,
      onKeyDown: this.onKeyDown,
      onMouseEnter: this.props.usePointerEvents ? this.triggerOpen : null,
      onMouseLeave: this.props.usePointerEvents ? this.triggerClose : null
    }

    // If there's a destination use a Hyperlink.
    if (this.props.destination) {
      /* 
        Wrap the Hyperlink in a span because the we need access to a ref 
        in order to manually set focus. Hyperlink is a functional component 
        so no ref can be set on it.
      */
      return (
        <Hyperlink {...props} />
      );
    } else {
      return (
        <button {...props}>{this.props.content}</button>
      );
    }
  }
}
