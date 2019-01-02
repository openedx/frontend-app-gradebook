import React from 'react';
import { Hyperlink, Icon } from '@edx/paragon';
import { configuration } from '../../config';

import EdxLogo from '../../../assets/edx-sm.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
    };
  }

  renderLogo() {
    return (
      <img src={EdxLogo} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    return (
      <div className="mb-3">
        <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
          <Hyperlink content={this.renderLogo()} destination="https://www.edx.org" />
          <div />
        </header>
        {this.state.mobileNavOpen &&
        <nav className="d-flex flex-column weight-bold size-16">
          <a href="https://www.google.com" className="nav-link border-bottom-gray">Rick</a>
          <a href="https://www.google.com" className="nav-link border-bottom-gray">Alex</a>
          <a href="https://www.google.com" className="nav-link border-bottom-gray">Jasen</a>
          <a href="https://www.google.com" className="nav-link border-bottom-gray">Doug</a>
          <a href="https://www.google.com" className="nav-link border-bottom-gray">Simon</a>
        </nav>
        }
      </div>
    );
  }
}
