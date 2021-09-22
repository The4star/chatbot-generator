import React from 'react';
import ReactMarkdown from 'react-markdown';

// icons
import CloseIcon from '../../../img/CloseIcon';

interface WelcomeMessageProps {
  message: string;
  closeNotification: () => void;
}
const Notification = ({ message, closeNotification }: WelcomeMessageProps) => {

  return (
    <div className="welcome-message-wrapper">
      <div className="text-area">
        <ReactMarkdown source={message} />
      </div>
      <div className="close-button" onClick={closeNotification}>
        <CloseIcon />
      </div>
    </div>
  )
}

export default Notification;