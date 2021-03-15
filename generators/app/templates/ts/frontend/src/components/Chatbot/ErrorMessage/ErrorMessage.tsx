import React from 'react';

const restartChat = () => {
    window.location.reload(false);
}

const ErrorMessage = () => {
    //shown if the chatbot does not respond
    return (
        <div className="error-wrapper">
            <div className="error-image">
                <p>!</p>
            </div>
            <div className="message-field">
                <h3>Versa chat failed to respond</h3>
                <p>Please try <span onClick={() => restartChat()}>reloading the window</span> or alternatively <a href="https://versa.agency/contact" target="_blank" rel="noopener noreferrer">contact us here</a>. </p>
            </div>
        </div>
    )

}

export default ErrorMessage;