import React from 'react';

import './info-popup.styles.scss'

const InfoPopup = ({message, restart}) => {
    // this is an information popup you can render
    // to inform users of any wait times.
    return (
        <div className="info-wrapper">
            <div className="info-container">
                <div className="main-section">
                    <div className="info">
                        <p className="icon">&#9432;</p>
                    </div>
                    <div className="message-box">
                        <p>
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default InfoPopup;