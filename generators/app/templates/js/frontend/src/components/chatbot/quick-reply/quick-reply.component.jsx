import React from 'react';

import './quick-reply.styles.scss';
import { linkOut } from '../../../img/img-variables';

const QuickReply = ({text, payload, link, reactLink, handleQuickReply}) => (
    <div className="quick-reply">
        {
            link === null ?
            <button onClick={() => handleQuickReply(text, payload)}>{text}</button>
            : 
            <a href={link} target="_blank" rel="noopener noreferrer"><button className="link-button">{text} {linkOut} </button></a> 
        }
    </div>
)

export default QuickReply;