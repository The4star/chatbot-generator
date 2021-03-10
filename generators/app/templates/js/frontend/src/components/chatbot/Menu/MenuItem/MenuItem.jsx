import React from 'react';

const MenuItem = ({ title, image, link, functionName }) => {

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