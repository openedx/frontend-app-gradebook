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
        <Media query="(max-width: 992px)">
          {matches =>
            (matches ? (
              <header className="border-bottom-blue">
                <div className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
                  <button className="border-0 mr-auto" onClick={() => this.setState({ mobileNavOpen: !this.state.mobileNavOpen })}>
                    <Icon className={classNames('fa', 'fa-2x', 'color-gray', { 'fa-bars': !this.state.mobileNavOpen }, { 'fa-times': this.state.mobileNavOpen })} />
                  </button>
                  <Hyperlink content={this.renderLogo()} destination="https://www.edx.org" />
                </div>
                {this.state.mobileNavOpen &&
                  <div>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Rick</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Alex</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Zach</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Jansen</a>
                    <a className="nav-link border-bottom-gray" href="https://www.google.com">Simon</a>
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
