import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';

export default class MenuTrigger extends React.Component {
  constructor(props) {
    super(props);

    this.triggerOpen = this.triggerOpen.bind(this);
    this.triggerClose = this.triggerClose.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  // Expose this for parent components as recommended by Facebook
  // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Managing-Focus.md
  focus() {
    this.refs.trigger.querySelectorAll('a, button')[0].focus();
  }

  triggerOpen(triggerElement) {
    this.props.triggerOpen(this.props.menuName, triggerElement);
  }

  triggerClose() {
    
    this.props.triggerClose(this.props.menuName);
  }

  onKeyDown(e) {
    if (!this.props.expanded) return;
    switch(e.key) {
      case 'Escape': // ESC
        e.preventDefault();
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
      onMouseEnter: this.props.triggerOnHover ? this.triggerOpen : null,
      onMouseLeave: this.props.triggerOnHover ? this.triggerClose : null
    }

    // If there's a destination use a Hyperlink.
    if (this.props.destination) {
      /* 
        Wrap the Hyperlink in a span because the we need access to a ref 
        in order to manually set focus. Hyperlink is a functional component 
        so no ref can be set on it.
      */
      return (
        <span ref="trigger">
          <Hyperlink {...props} />
        </span>
      );
    } else {
      return (
        <button ref="trigger" {...props}>{this.props.content}</button>
      );
    }
  }
}
