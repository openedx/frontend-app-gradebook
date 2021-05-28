import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

export default class Header extends React.Component {

  constructor(props){
    super(props);
  }

  renderLogo() {
    return (
      <img src={getConfig().LOGO_URL} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    const {
      logoDestination
    } = this.props;
    const logoProps = { destination: logoDestination}
    return (
      <div className="mb-3">
        <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
          <Hyperlink {...logoProps}>
            {this.renderLogo()}
          </Hyperlink>
          <div />
        </header>
      </div>
    );
  }
}
