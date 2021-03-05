import React from 'react';

import './error-message.styles.scss'

const restartChat = () => {
    window.location.reload(false);
}

const ErrorMessage = ({message}) => {
    //shown if the chatbot does not respond
    return (
        <div className="error-wrapper">
            <div className="error-image">
                <p>!</p>
            </div>
            <div className="message-field">
                <h3>Versa chat failed to respond</h3>
                <p>Please try <span onClick={() => restartChat()}>reloading the window</span> or alternatively <a href="https://versa.agency/contact" target="_blank"rel="noopener noreferrer">contact us here</a>. </p>
            </div>
        </div>
    )

}

export default ErrorMessage;