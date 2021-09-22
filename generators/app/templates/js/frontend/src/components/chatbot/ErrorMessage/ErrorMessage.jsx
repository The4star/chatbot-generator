import React from 'react';

const restartChat = () => {
    window.location.reload();
}

const ErrorMessage = ({ message }) => {
    //shown if the chatbot does not respond
    return (
        <div className="error-wrapper">
            <div className="error-image">
                <p>!</p>
            </div>
            <div className="message-field">
                <h3><%=chatbotName%> failed to respond</h3>
                <p>Please try <span onClick={() => restartChat()}>reloading the window</span> or alternatively <a href="https://www.clintonforster.com" target="_blank" rel="noopener noreferrer">contact us here</a>. </p>
            </div>
        </div>
    )

}

export default ErrorMessage;