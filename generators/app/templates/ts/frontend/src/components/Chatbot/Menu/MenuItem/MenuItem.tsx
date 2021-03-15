import React from 'react';

interface MenuItemProps {
  title: string;
  ImageToUse: () => JSX.Element;
  link?: string;
  functionName: () => void;
}

const MenuItem = ({ title, ImageToUse, link, functionName }: MenuItemProps) => {

  if (link) {
    return (
      <div className="menu-item">
        <ImageToUse />
        <p>
          {title}
        </p>
      </div>
    )
  } else {
    return (
      <div className="menu-item" onClick={functionName}>
        <ImageToUse />
        <p>
          {title}
        </p>
      </div>
    )
  }

}

export default MenuItem;