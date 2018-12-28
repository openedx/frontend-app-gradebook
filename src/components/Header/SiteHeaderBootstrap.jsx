import React from 'react';
import classNames from 'classnames';
import { Hyperlink, Dropdown, SearchField,
  breakpoints, ExtraSmall, Small, Medium, Large, ExtraLarge, LargerThanExtraSmall
} from '@edx/paragon';
import Menu from './Menu';
import EdxLogo from '../../../assets/edx-sm.png';


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBars, faTimes, faSearch, 
  faChevronLeft, faChevronRight, faChevronDown 
} from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown);


export default class SiteHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
      openSubmenuIndex: null
    };
  }

  onClickMenuLink(index, e) {
    this.setState({
      panelOpen: true,
      openSubmenuIndex: index
    });
  }

  onClickSubmenuClose(e) {
    this.setState({
      panelOpen: false
    });
  }

  render() {
    return (
      <div>
        <ExtraSmall>{this.renderMobileNav()}</ExtraSmall>
        <Small>{this.renderMobileNav()}</Small>
        <Medium>{this.renderMobileNav()}</Medium>
        <Large>{this.renderDesktopNav()}</Large>
        <ExtraLarge>{this.renderDesktopNav()}</ExtraLarge>
      </div>
    );
  }

  renderMobileNav() {
    const openSubmenu = this.state.openSubmenuIndex !== null ? this.props.menuItems[this.state.openSubmenuIndex] : null;

    return (
      <nav className="navbar navbar-mobile flex-nowrap">
        <div style={{flexBasis: "50%"}}>
          <Menu 
            className={classNames("top-level-menu", "hamburger-menu")} 
            triggerClassName="nav-link"
            triggerContent={<span><FontAwesomeIcon icon="bars" /></span>}
            expanded={false}
          >
            
            <div className={classNames("slide-panel", {
                "panel-open": this.state.panelOpen
              })}>
                <div className="panels">
                  <div className="panel">
                    {this.props.menuItems.map(function(item, index) {
                    if (item.submenu) {
                      return (
                        <button 
                          type="button"
                          className={classNames(
                            "nav-link", 
                            item.name + "-primary-menu-link"
                          )}
                          key={'link-' + index}
                          onClick={this.onClickMenuLink.bind(this, index)}
                        >{item.content} <FontAwesomeIcon icon="chevron-right" /></button>
                      );
                    } else {
                      return (
                        <Hyperlink 
                          className={classNames(
                            "nav-link", 
                            item.name + "-primary-menu-link"
                          )}
                          key={'link-' + index}
                          {...item} 
                        />
                      )
                    }
                  }, this)}
                  </div>

                  {openSubmenu ? (
                    <div className={classNames(
                      "panel", 
                      openSubmenu.name + "-panel"
                    )}>
                      <button 
                          type="button"
                          className="nav-link"
                          onClick={this.onClickSubmenuClose.bind(this)}
                        ><FontAwesomeIcon icon="chevron-left" /> Go Back</button>
                        <div className="panel-content">
                          {this.props.desktopMenuItems[this.state.openSubmenuIndex].submenu}
                        </div>
                    </div>
                  ): null}
                </div>
              </div>

          </Menu>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center" style={{flexBasis: "50%"}}>
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img style={{height:'32px'}} src={EdxLogo} alt="edX" />
          </a>
        </div>

        <div className="d-flex align-items-center justify-content-end"
          style={{flexBasis: "50%"}}>
        <Menu 
          className={classNames("top-level-menu")} 
          triggerClassName="nav-link"
          triggerContent={<span><FontAwesomeIcon icon="search" /></span>}
          expanded={false}
        >
          <SearchField onSubmit={(value) => { console.log(value); }} />
        </Menu>
          <Hyperlink 
            className={classNames("btn", "btn-outline")}
            content="Log in"
            destination="#login"
          />
          <Hyperlink 
            className={classNames("btn", "btn-primary", "mr-sm-2")}
            content="Register"
            destination="#login"
          />
        </div>
      </nav>     
    );
  }

  renderDesktopNav() {
    return (
      <nav className="navbar navbar-expand-lg navbar-desktop">
        <a className="navbar-brand align-self-stretch d-flex align-items-center" href="#">
          <img style={{height:'32px'}} src={EdxLogo} alt="edX" />
        </a>

        <ul className="navbar-nav mr-auto">
          {this.props.desktopMenuItems.map(function(item, index) {
            if (item.submenu) {
              return (
                <Menu 
                  key={"menu-" + index}
                  className={classNames("top-level-menu", item.name + "-top-level-menu")} 
                  triggerClassName="nav-link"
                  triggerContent={<span>{item.content} <FontAwesomeIcon icon="chevron-down" /></span>}
                  triggerDestination={item.destination}
                  respondToPointerEvents
                  expanded={false}
                >
                  {item.submenu}
                </Menu>
              );
            } else {
              return (
                <Hyperlink 
                  className={classNames("nav-link", item.name + "-top-level-link")}
                  key={'link-' + index}
                  {...item} 
                />
              )
            }
          })}
        </ul>

        <ul className="navbar-nav">
          <li className="mr-sm-2">
            <SearchField onSubmit={(value) => { console.log(value); }} />
          </li>
          <li className="mr-sm-2">
            <Hyperlink 
              className={classNames("btn", "btn-outline")}
              content="Log in"
              destination="#login"
            />
          </li>
          <li>
            <Hyperlink 
              className={classNames("btn", "btn-primary")}
              content="Register"
              destination="#login"
            />
          </li>
        </ul>
      </nav>     
    );
  }
}