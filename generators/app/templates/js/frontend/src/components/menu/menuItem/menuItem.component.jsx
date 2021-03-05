import React from 'react';

import './menuItem.styles.scss'

const MenuItem = ({title, image, imageClass, link, functionName }) => {
  
  if (link) {
    return (
      <div className="menu-item">
        {image}
        <p>
          {title}
        </p>
      </div>
    )
  } else {
    return (
      <div className="menu-item" onClick={functionName}>
        {image}
        <p>
          {title}
        </p>
      </div>
    )
  }
  
}

export default MenuItem;