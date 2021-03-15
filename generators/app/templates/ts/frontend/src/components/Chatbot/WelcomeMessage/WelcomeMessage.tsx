import React from 'react';
import ReactMarkdown from 'react-markdown';

// icons
import CloseIcon from '../../../img/CloseIcon';

interface WelcomeMessageProps {
  welcomeMessage: string;
  closeWelcomeMessage: () => void;
}
const WelcomeMessage = ({ welcomeMessage, closeWelcomeMessage }: WelcomeMessageProps) => {

  return (
    <div className="welcome-message-wrapper">
      <div className="text-area">
        <ReactMarkdown source={welcomeMessage} />
      </div>
      <div className="close-button" onClick={closeWelcomeMessage}>
        <CloseIcon />
      </div>
    </div>
  )
}

export default WelcomeMessage;