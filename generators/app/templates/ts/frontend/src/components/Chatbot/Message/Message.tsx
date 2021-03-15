import React from 'react';
import spacetime from 'spacetime';
import ReactMarkdown from 'react-markdown';

// components
import Card from '../Card/Card';
import QuickReply from '../QuickReply/QuickReply';
import { IDialogflowQueryResponseCard, IDialogflowQueryResponseChip } from '../../../types/state.types';

interface MessageProps {
    speaker?: string;
    text?: string;
    cards?: IDialogflowQueryResponseCard[];
    chips?: IDialogflowQueryResponseChip[];
    handleQuickReply?: (payload: string) => void;
    cardStyle?: boolean;
    qRStyle?: boolean;
    scriptStyle?: boolean;
}

const Message = ({ speaker, text, cards, chips, handleQuickReply, cardStyle, qRStyle, scriptStyle }: MessageProps) => (

    <>
        {speaker !== 'user' ?
            <div className="message-wrapper">

                {!cardStyle && !qRStyle && !scriptStyle ?
                    <div className="avatar-section">
                        <div className="avatar-section__avatar">
                        </div>
                    </div>
                    :
                    null
                }

                <div className={cardStyle ? "message-container-bot-cards" : "message-container-bot" && qRStyle ? "message-container-bot-quick-replies" : "message-container-bot" && scriptStyle ? "message-container-script" : "message-container-bot"}>

                    {!cardStyle && !qRStyle && !scriptStyle ?
                        <div className="bot-header">
                            <p>{speaker}</p>
                            <p>{spacetime.now().time()}</p>
                        </div>
                        :
                        null
                    }

                    {
                        text &&
                        <div className="message-content">
                            <ReactMarkdown source={text} />
                        </div>
                    }
                    {
                        cards &&
                        <>
                            <div className="cards-container">
                                {
                                    cards.map((card, i) => {
                                        return <Card
                                            key={i}
                                            title={card.title}
                                            subtitle={card.subtitle}
                                            link={card.link}
                                            image={card.image}
                                        />
                                    })
                                }
                            </div>
                        </>
                    }
                    {
                        chips &&
                        <div className="quick-replies-container">
                            {
                                handleQuickReply && chips.map((chip, i) => {
                                    return <QuickReply
                                        key={i}
                                        text={chip.value}
                                        payload={chip.value}
                                        link={chip.link ? chip.link : null}
                                        handleQuickReply={handleQuickReply}
                                    />
                                })
                            }
                        </div>
                    }

                </div>
            </div>
            : null

        }
        {
            speaker === 'user' ?
                <div className="message-wrapper">
                    <div className="message-container-user">
                        <div className="message-content">
                            <p>{text}</p>
                        </div>
                    </div>
                </div>
                : null
        }
    </>
)

export default Message;
