import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

export default class Header extends React.Component {
  renderLogo() {
    return (
      <img src={getConfig().LOGO_URL} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    return (
      <div className="mb-3">
        <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
          <Hyperlink destination="https://www.edx.org">
            {this.renderLogo()}
          </Hyperlink>
          <div />
        </header>
      </div>
    );
  }
}
