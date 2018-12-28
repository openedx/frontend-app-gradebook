import React from 'react';
import SiteHeader from './SiteHeader';
import { Hyperlink } from '@edx/paragon';

const Header = () => {
  return (
    <SiteHeader 
      menuItems={MENU_ITEMS}
      desktopMenuItems={DESKTOP_MENU_ITEMS}
    />
  );
}

export default Header;



const MENU_ITEMS = [
  {
    content: "Courses",
    name: "courses",
    destination: "#",
    submenu: (
      <div>
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
  },
  {
    content: "Programs",
    name: "programs",
    destination: "#",
    submenu: (
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
    )
  },
  {
    content: "Schools",
    name: "schools",
    destination: "#"
  },
  {
    content: "Enterprise",
    name: "enterprise",
    destination: "#"
  }
]

const DESKTOP_MENU_ITEMS = [
  {
    content: "Courses",
    name: "courses",
    destination: "#",
    submenu: (
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
  },
  {
    content: "Programs",
    name: "programs",
    destination: "#",
    submenu: (
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
    )
  },
  {
    content: "Schools",
    name: "schools",
    destination: "#"
  },
  {
    content: "Enterprise",
    name: "enterprise",
    destination: "#"
  }
]