import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Icon } from '@edx/paragon';
import PropTypes from 'prop-types';

import apiClient from '../../data/apiClient';
import { configuration } from '../../config';
import EdxLogo from '../../../assets/edx-sm.png';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      mobileNavOpen: false,
    };
  }

  toggle() {
    this.setState({
      mobileNavOpen: !this.state.mobileNavOpen,
    });
  }

  getUserProfileImageIcon() {
    const screenReaderText = `Profile image for ${this.props.username}`;

    if (this.props.userProfileImageUrl) {
      return <img src={this.props.userProfileImageUrl} alt={screenReaderText} />;
    }
    return <Icon className={['fa', 'fa-user', 'px-3']} screenReaderText={screenReaderText} />;
  }

  render() {
    return (
      <Navbar light expand="md" className="border-bottom">
        <NavbarBrand href={configuration.LMS_BASE_URL}>
          <img src={EdxLogo} alt="edX logo" height="30" width="60" />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.mobileNavOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {this.getUserProfileImageIcon()}
                {this.props.username}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href={`${configuration.LMS_BASE_URL}/dashboard`}>
                  Dashboard
                </DropdownItem>
                <DropdownItem href={`${configuration.LMS_BASE_URL}/u/${this.props.username}`}>
                  Profile
                </DropdownItem>
                <DropdownItem href={`${configuration.LMS_BASE_URL}/account/settings`}>
                  Account
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => apiClient.logout()}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

Header.defaultProps = {
  username: null,
  userProfileImageUrl: null,
};

Header.propTypes = {
  username: PropTypes.string,
  userProfileImageUrl: PropTypes.string,
};

export default Header;
