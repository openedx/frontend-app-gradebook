import React from 'react';
import classNames from 'classnames';
import { 
  Hyperlink, 
  Button,
  SearchField,
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
        <Medium>{this.renderDesktopNav()}</Medium>
        <Large>{this.renderDesktopNav()}</Large>
        <ExtraLarge>{this.renderDesktopNav()}</ExtraLarge>
      </div>
    );
  }

  renderMobileNav() {
    const openSubmenu = this.state.openSubmenuIndex !== null ? this.props.menuItems[this.state.openSubmenuIndex] : null;

    return (
      <header className="site-header mobile">
        <div className="site-header-wrap">
          
          <div className="primary-menu-container">
            <Menu 
              className="primary-menu"
              triggerClassName="top-level-link"
              triggerContent={<FontAwesomeIcon icon="bars" />}
              triggerExpandedContent={<FontAwesomeIcon icon="times" />}
              respondToPointerEvents={false}
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
                            "primary-menu-link", 
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
                            "primary-menu-link", 
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
                          className="primary-menu-link"
                          onClick={this.onClickSubmenuClose.bind(this)}
                        ><FontAwesomeIcon icon="chevron-left" /> Go Back</button>
                        <div className="panel-content">
                          {openSubmenu.submenu}
                        </div>
                    </div>
                  ): null}
                </div>
              </div>
            </Menu>
          </div>

          <div className="center-logo">
            {this.renderLogo()}
          </div>

          <div className="secondary-menu-container">
            <Menu 
              className="search-menu"
              triggerClassName="top-level-link"
              triggerContent={<FontAwesomeIcon icon="search" />}
              respondToPointerEvents={false}
              expanded={null}
            >
              <SearchField onSubmit={(value) => { console.log(value); }} />
            </Menu>

            <Menu 
              className="account-menu"
              triggerClassName="top-level-link account-trigger"
              triggerContent="Account"
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


  renderDesktopNav() {
    const openSubmenu = this.state.openSubmenuIndex !== null ? this.props.desktopMenuItems[this.state.openSubmenuIndex] : null;

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
              triggerContent="Account"
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
      <div>Account Stuff</div>
    )
  }
}

