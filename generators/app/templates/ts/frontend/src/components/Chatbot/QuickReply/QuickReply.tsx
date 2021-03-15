import React from 'react';

import LinkOutIcon from '../../../img/LinkOutIcon';

interface QuickReplyProps {
    text: string;
    payload: string;
    link: string | null
    handleQuickReply: (payload: string) => void;
}
const QuickReply = ({ text, payload, link, handleQuickReply }: QuickReplyProps) => (
    <div className="quick-reply">
        {
            link === null ?
                <button onClick={() => handleQuickReply(payload)}>{text}</button>
                :
                <a href={link} target="_blank" rel="noopener noreferrer"><button className="link-button">{text} <LinkOutIcon /> </button></a>
        }
    </div>
)

export default QuickReply;