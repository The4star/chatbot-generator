import React from 'react';
import ReactMarkdown from 'react-markdown';

// icons
import { closeIcon } from '../../../img/img-variables';

const WelcomeMessage = ({ welcomeMessage, closeWelcomeMessage }) => {

  return (
    <div className="welcome-message-wrapper">
      <div className="text-area">
        <ReactMarkdown source={welcomeMessage} />
      </div>
      <div className="close-button" onClick={closeWelcomeMessage}>
        {closeIcon}
      </div>
    </div>
  )
}

export default WelcomeMessage;