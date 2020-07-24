import React from 'react';

import './menu.styles.scss';

const Menu = (props) => (
  <div className="menu">
    {props.children}
  </div>
)

export default Menu;