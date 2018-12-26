import React from 'react';
import classNames from 'classnames';
import { Hyperlink } from '@edx/paragon';
import MainNav from './MainNav';

import EdxLogo from '../../../assets/edx-sm.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      openMenu: "MAIN_NAV"
    };
  }

  onMenuTriggerClick(targetName, e) {
    console.log(targetName, this.state.openMenu)
    if (targetName == this.state.openMenu) {
      this.setState({openMenu: null});
    } else {
      this.setState({openMenu: targetName});
    }
  }


  render() {
    return (
      <header className="site-header">

        <div className="left-menu">
          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "MAIN_NAV")}>Hamburger</button>
          {this.state.openMenu == "MAIN_NAV" ? this.renderMainMenu() : null}
        </div>

        <div className="site-header-logo">
          <Hyperlink content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} destination="https://www.edx.org" />
        </div>

        <div className="right-menu">
          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "SEARCH")}>Search</button>
          {this.state.openMenu == "SEARCH" ? this.renderSearchMenu() : null}

          <button className="menu-button" onClick={this.onMenuTriggerClick.bind(this, "ACCOUNT")}>Search</button>
          {this.state.openMenu == "ACCOUNT" ? this.renderAccountMenu() : null}
        </div>
      </header>
    );
  }

  renderMainMenu() {
    return (
      <div className="menu">
        <MainNav />
      </div>
    )
  }

  renderSearchMenu() {
    return (
      <div className="menu">
        Search Menu
      </div>
    )
  }

  renderAccountMenu() {
    return (
      <div className="menu">
        Account Menu
      </div>
    )
  }
}
