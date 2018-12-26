import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import NavMenu from './NavMenu';

import { Hyperlink } from '@edx/paragon';

export default class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedMenu: null
    }

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  openMenu(name) {
    this.setState({expandedMenu: name});
  }

  closeMenu(name) {
    if (this.state.expandedMenu === name) {
      this.setState({expandedMenu: null});
    }
  }

  render() {
    return (
      <nav className={classNames("main-nav", {
        "has-expanded-menu": this.state.expandedMenu !== null
      })}>
        <div className="nav-wrap">
          <NavMenu
            title="Courses"
            expanded={this.state.expandedMenu === "Courses"}
            open={this.openMenu.bind(null, "Courses")}
            close={this.closeMenu.bind(null, "Courses")}
            usePointerEvents={false}
          >
            <h4>Courses by Subject</h4>
            <Hyperlink content="Computer Science" destination="#" />
            <Hyperlink content="Language" destination="#" />
            <Hyperlink content="Data & Statistics" destination="#" />
            <Hyperlink content="Business & Management" destination="#" />
            <Hyperlink content="Engineering" destination="#" />
            <Hyperlink content="Humanities" destination="#" />
            <Hyperlink content="View all courses by subjects" destination="#" />
          </NavMenu>

          <NavMenu 
            title="Programs & Degrees"
            expanded={this.state.expandedMenu === "Programs & Degrees"}
            open={this.openMenu.bind(null, "Programs & Degrees")}
            close={this.closeMenu.bind(null, "Programs & Degrees")}
            usePointerEvents={false}
          >
            <h4>Programs & Degrees</h4>
            <Hyperlink content="MicroMasters Program" destination="#" />
            <Hyperlink content="Professional Certificate" destination="#" />
            <Hyperlink content="Online Master's Degree" destination="#" />
            <Hyperlink content="Global Freshman Academy" destination="#" />
            <Hyperlink content="XSeries" destination="#" />
          </NavMenu>
          
          <Hyperlink className="nav-item" content="Schools & Partners" destination="#" />
          <Hyperlink className="nav-item" content="edX for Business" destination="#" />
        </div>

      </nav>
    );
  }
}