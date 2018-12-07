import React from 'react';
import { Hyperlink } from '@edx/paragon';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
    };
  }

  render() {
    return (
      <div className="mb-3">
        <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
          <Hyperlink content={<img src="./assets/edx-sm.png" alt="The edX logo" height="30" width="60" />} destination="https://www.edx.org" />
          <div />
        </header>
      </div>
    );
  }
}
