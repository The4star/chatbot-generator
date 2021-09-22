import React from 'react';
import ReactMarkdown from 'react-markdown';

// icons
import { closeIcon } from '../../../img/img-variables';

const Notification = ({ message, closeNotification }) => {
  return (
    <div className="welcome-message-wrapper">
      <div className="text-area">
        <ReactMarkdown source={message} />
      </div>
      <div className="close-button" onClick={closeNotification}>
        {closeIcon}
      </div>
    </div>
  )
}

export default Notification;