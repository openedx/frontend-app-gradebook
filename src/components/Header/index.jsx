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
import { faBars, faTimes, faSearch, faChevronLeft, faChevronRight,
          faChevronDown } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown);


export default class Header extends React.Component {
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
                  {MENU_ITEMS.map(function(item, index) {
                  if (item.submenu) {
                    return (
                      <button 
                        type="button"
                        className="primary-menu-link"
                        key={'link-' + index}
                        onClick={this.onClickMenuLink.bind(this, index)}
                      >{item.content} <FontAwesomeIcon icon="chevron-right" /></button>
                    );
                  } else {
                    return (
                      <Hyperlink 
                        className="primary-menu-link"
                        key={'link-' + index}
                        {...item} 
                      />
                    )
                  }
                }, this)}
                </div>

                <div className="panel">
                    <button 
                      type="button"
                      className="primary-menu-link"
                      onClick={this.onClickSubmenuClose.bind(this)}
                    ><FontAwesomeIcon icon="chevron-left" /> Go Back</button>

                    {this.state.openSubmenuIndex !== null ? MENU_ITEMS[this.state.openSubmenuIndex].submenu.content : 'null'}
                </div>
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
    return (
      <header className="site-header desktop">
        <div className="site-header-wrap">
          {this.renderLogo()}
          
          <div className="primary-menu-container">

            {DESKTOP_MENU_ITEMS.map(function(item, index) {
              if (item.submenu) {
                return (
                  <Menu 
                    key={"menu-" + index}
                    className="top-level-menu"
                    triggerClassName="top-level-link"
                    triggerContent={<span>{item.content} <FontAwesomeIcon icon="chevron-down" /></span>}
                    triggerDestination={item.destination}
                    respondToPointerEvents
                    expanded={false}
                  >
                    {item.submenu.content}
                  </Menu>
                );
              } else {
                return (
                  <Hyperlink 
                    className="top-level-link"
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

const MENU_ITEMS = [
  {
    content: "Courses",
    destination: "#",
    submenu: {
      content: (
        <div className="main-menu-courses">
          <div>
            <h3>Courses by subject</h3>
          </div>
          <ul>
            <li><Hyperlink content="Computer Science" destination="#" /></li>
            <li><Hyperlink content="Language" destination="#" /></li>
            <li><Hyperlink content="Data & Statistics" destination="#" /></li>
            <li><Hyperlink content="Business & Management" destination="#" /></li>
            <li><Hyperlink content="Engineering" destination="#" /></li>
            <li><Hyperlink content="Humanities" destination="#" /></li>
            <li><Hyperlink content="View all courses by subject" destination="#" /></li>
          </ul>
        </div>
      )
    }
  },
  {
    content: "Programs",
    destination: "#",
    submenu: {
      content: (
        <div className="main-menu-programs">
          <div>
            <h3>Programs & degrees</h3>
            <p>Pathways for your advancement</p>
          <ul>
            <li>
              <Hyperlink content="MicroMasters Program" destination="#" />
              <p>Graduate-level, for career advancement or a degree path</p>
            </li>

            <li>
              <Hyperlink content="Professional Certificate" destination="#" />
              <p>From employers or universities to build today's in-demand skills</p>
            </li>

            <li>
              <Hyperlink content="Online Master's Degree" destination="#" />
              <p>Top-ranked programs, affordable, and fully online</p>
            </li>

            <li>
              <Hyperlink content="Global Freshman Academy" destination="#" />
              <p>Freshman year courses for university credit from ASU</p>
            </li>

            <li>
              <Hyperlink content="XSeries" destination="#" />
              <p>Series of courses for a deep understanding of a topic</p>
            </li>
          </ul>
          </div>
        </div>
      )
    }
  },
  {
    content: "Schools",
    destination: "#"
  },
  {
    content: "Enterprise",
    destination: "#"
  }
]

const DESKTOP_MENU_ITEMS = [
  {
    content: "Courses",
    destination: "#",
    submenu: {
      content: (
        <div className="main-menu-courses">
          <div>
            <h3>Courses by subject</h3>
          </div>
          <ul>
            <li><Hyperlink content="Architecture" destination="#" /></li>
            <li><Hyperlink content="Art & Culture" destination="#" /></li>
            <li><Hyperlink content="Biology & Life Sciences" destination="#" /></li>
            <li><Hyperlink content="Business & Management" destination="#" /></li>
            <li><Hyperlink content="Chemistry" destination="#" /></li>
            <li><Hyperlink content="Communication" destination="#" /></li>
            <li><Hyperlink content="Computer Science" destination="#" /></li>
            <li><Hyperlink content="Data Analysis & Statistics" destination="#" /></li>
            <li><Hyperlink content="Design" destination="#" /></li>
            <li><Hyperlink content="Economics & Finance" destination="#" /></li>
            <li><Hyperlink content="Education & Teacher Training" destination="#" /></li>
            <li><Hyperlink content="Electronics" destination="#" /></li>
            <li><Hyperlink content="Energy & Earth Sciences" destination="#" /></li>
            <li><Hyperlink content="Engineering" destination="#" /></li>
            <li><Hyperlink content="Environmental Studies" destination="#" /></li>
            <li><Hyperlink content="Ethics" destination="#" /></li>
            <li><Hyperlink content="Food & Nutrition" destination="#" /></li>
            <li><Hyperlink content="Health & Safety" destination="#" /></li>
            <li><Hyperlink content="History" destination="#" /></li>
            <li><Hyperlink content="Humanities" destination="#" /></li>
            <li><Hyperlink content="Language" destination="#" /></li>
            <li><Hyperlink content="Law" destination="#" /></li>
            <li><Hyperlink content="Literature" destination="#" /></li>
            <li><Hyperlink content="Math" destination="#" /></li>
            <li><Hyperlink content="Medicine" destination="#" /></li>
            <li><Hyperlink content="Music" destination="#" /></li>
            <li><Hyperlink content="Philanthropy" destination="#" /></li>
            <li><Hyperlink content="Philosophy & Ethics" destination="#" /></li>
            <li><Hyperlink content="Physics" destination="#" /></li>
            <li><Hyperlink content="Science" destination="#" /></li>
            <li><Hyperlink content="Social Sciences" destination="#" /></li>
            <li><Hyperlink content="All Subjects »" destination="#" /></li>


          </ul>
        </div>
      )
    }
  },
  {
    content: "Programs",
    destination: "#",
    submenu: {
      content: (
        <div className="main-menu-programs">
          <div>
            <h3>Programs & degrees</h3>
            <p>Pathways for your advancement</p>
          <ul>
            <li>
              <Hyperlink content="MicroMasters Program" destination="#" />
              <p>Graduate-level, for career advancement or a degree path</p>
            </li>

            <li>
              <Hyperlink content="Professional Certificate" destination="#" />
              <p>From employers or universities to build today's in-demand skills</p>
            </li>

            <li>
              <Hyperlink content="Online Master's Degree" destination="#" />
              <p>Top-ranked programs, affordable, and fully online</p>
            </li>

            <li>
              <Hyperlink content="Global Freshman Academy" destination="#" />
              <p>Freshman year courses for university credit from ASU</p>
            </li>

            <li>
              <Hyperlink content="XSeries" destination="#" />
              <p>Series of courses for a deep understanding of a topic</p>
            </li>
          </ul>
          </div>
        </div>
      )
    }
  },
  {
    content: "Schools",
    destination: "#"
  },
  {
    content: "Enterprise",
    destination: "#"
  }
]
