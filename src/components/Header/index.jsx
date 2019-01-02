import React from 'react';
import classNames from 'classnames';
import SiteHeader from './SiteHeader';

import { 
  MOBILE_MENU_ITEMS, 
  DESKTOP_MENU_ITEMS 
} from './MenuItems.constants';

const Header = () => {
  return (
     <SiteHeader 
      menuItems={MOBILE_MENU_ITEMS}
      desktopMenuItems={DESKTOP_MENU_ITEMS}
    />  
  );
}

export default Header;
