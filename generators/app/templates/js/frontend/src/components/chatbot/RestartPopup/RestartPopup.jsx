import React from 'react';

const restartChat = () => {
    window.location.reload();
}

const RestartPopup = () => {
    return (
        <div className="restart-wrapper">
            <div className="info-container">
                <div className="message-box">
                    <h3>
                        Thanks for chatting with us
                    </h3>
                    <p>
                        If you have any more questions
                    </p>
                    <p>
                        please reach out to us again
                    </p>
                </div>
                <p className="restart-button" onClick={() => restartChat()}>Start a new chat</p>
            </div>
        </div>
    )
}

export default RestartPopup;