import React from 'react';
import classNames from 'classnames';
import { 
  Hyperlink, 
  Button,
  SearchField,
  breakpoints, ExtraSmall, Small, Medium, Large, ExtraLarge, LargerThanExtraSmall
} from '@edx/paragon';
import Menu from './Components/Menu';
import EdxLogo from '../../../assets/edx-sm.png';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBars, faTimes, faSearch, 
  faChevronLeft, faChevronRight, faChevronDown,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown, faUserCircle);


export default class SiteHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panelSubmenuOpen: false
    };
  }

  render() {
    return (
      <div>
        <ExtraSmall>{this.renderMobileNav()}</ExtraSmall>
        <Small>{this.renderMobileNav()}</Small>
        <Medium>{this.renderDesktopNav()}</Medium>
        <Large>{this.renderDesktopNav()}</Large>
        <ExtraLarge>{this.renderDesktopNav()}</ExtraLarge>
      </div>
    );
  }

  renderMobileNav() {
    return (
      <header className="site-header mobile">
        <div className="site-header-wrap">

          <div className="nav-row primary-nav">
            <Menu 
              className="overlay-panel-menu"
              triggerClassName="btn icon-button account-trigger"
              triggerContent={<FontAwesomeIcon icon="bars" />}
              respondToPointerEvents={false}
              expanded={null}
              transitionTimeout={400}
              transitionClassName="overlay-panel"
              closeButton={<button className="overlay-close" ><span><FontAwesomeIcon icon="times" /></span></button>}
            >
              {this.renderSlidingPanelMenu()}
            </Menu>
          </div>

          <div className="nav-row brand">
            {this.renderLogo()}
          </div>

          <div className="nav-row secondary-menu-container">
            <Menu 
              className="search-menu"
              triggerClassName="btn icon-button"
              triggerContent={<FontAwesomeIcon icon="search" />}
              respondToPointerEvents={false}
              expanded={null}
            >
              <SearchField onSubmit={(value) => { console.log(value); }} />
            </Menu>

            <Menu 
              className="account-menu"
              triggerClassName="btn icon-button account-trigger"
              triggerContent={<FontAwesomeIcon icon="user-circle" />}
              respondToPointerEvents={false}
              expanded={null}
            >
              {this.renderAccountMenuContent()}
            </Menu>
          </div>
        </div>
      </header>
    );
  }

  renderSlidingPanelMenu() {
    return (
      <div className={classNames("slide-panel", {
        "panel-submenu-open": this.state.panelSubmenuOpen
      })}>
        <div className="panels">
          <div className="primary-menu-container">{
            this.props.desktopMenuItems.map(function(item, index) {

              if (item.submenu) {

                return (
                  <Menu 
                    key={"menu-" + index}
                    className={classNames("sliding-menu", item.name + "-sliding-menu")} 
                    triggerClassName="nav-link"
                    triggerContent={<span>{item.content} <FontAwesomeIcon icon="chevron-right" /></span>}
                    triggerDestination={item.destination}
                    respondToPointerEvents={false}
                    expanded={false}
                    onOpen={() => { this.setState({panelSubmenuOpen:true}) }}
                    onClose={() => { this.setState({panelSubmenuOpen:false}) }}
                    closeButton={<button className="nav-link" type="button"><FontAwesomeIcon icon="chevron-left" /><span>Close</span></button>}
                    transitionTimeout={400}
                    ignoreDocumentClicks
                  >
                    {item.submenu}
                  </Menu>
                );

              } else {

                return (
                  <Hyperlink 
                    className={classNames("nav-link", item.name + "-nav-link")}
                    key={'link-' + index}
                    {...item} 
                  />
                );

              }

            }, this)
          }</div>
        </div>
      </div>
    )
  }

  renderDesktopNav() {
    return (
      <header className="site-header desktop">
        <div className="site-header-wrap">
          {this.renderLogo()}
          
          <div className="primary-menu-container">

            {this.props.desktopMenuItems.map(function(item, index) {
              if (item.submenu) {
                return (
                  <Menu 
                    key={"menu-" + index}
                    className={classNames("top-level-menu", item.name + "-top-level-menu")} 
                    triggerClassName="top-level-link"
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
                    className={classNames("top-level-link", item.name + "-top-level-link")}
                    key={'link-' + index}
                    {...item} 
                  />
                )
              }
            })}
          </div>

          <div className="secondary-menu-container">
            <SearchField onSubmit={(value) => { console.log(value); }} />
            
            <Menu 
              className="account-menu"
              triggerClassName="top-level-link account-trigger"
              triggerContent={<span>My Account <FontAwesomeIcon icon="chevron-down" /></span>}
              triggerDestination="#account"
              respondToPointerEvents
              expanded={null}
            >
              {this.renderAccountMenuContent()}
            </Menu>
          </div>
        </div>
      </header>
    );
  }

  renderLogo() {
    return (
      <Hyperlink 
        className="header-logo" 
        content={<img src={EdxLogo} alt="edX logo" height="30" width="60" />} 
        destination="https://www.edx.org" 
      />
    )
  }

  renderAccountMenuContent() {
    return (
      <div>
        <Hyperlink content="Sign In" destination="#" />
        <Hyperlink content="Register" destination="#" />
      </div>
    )
  }
}