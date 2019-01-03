import React from 'react';
import { Hyperlink, Icon } from '@edx/paragon';
import classNames from 'classnames';
import Media from 'react-media';

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
        <Media query="(max-width: 901px)">
          {matches =>
            (matches ? (
              <header className="border-bottom-blue">
                <div className="p-3 border-bottom-blue">
                  <button className="border-0" onClick={() => this.setState({ mobileNavOpen: !this.state.mobileNavOpen })}>
                    <Icon className={classNames('fa', 'fa-2x', 'color-gray', { 'fa-bars': !this.state.mobileNavOpen }, { 'fa-times': this.state.mobileNavOpen })} />
                  </button>
                  <Hyperlink className="header-logo" content={this.renderLogo()} destination="https://www.edx.org" />
                </div>
                {this.state.mobileNavOpen &&
                  <div>
                    <a className="nav-link border-bottom-gray" href="https://support.edx.org">Help</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Dashboard</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Profile</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Account</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Sign Out</a>
                  </div>}
              </header>
          ) : (
            <header>
              <h1>hello world</h1>
            </header>))
        }
        </Media>
      </div>
    );
  }
}
