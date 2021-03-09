import React from 'react';
import spacetime from 'spacetime';
import ReactMarkdown from 'react-markdown';

// components
import Card from '../Card/Card';
import QuickReply from '../QuickReply/QuickReply';

const Message = ({ speaker, text, cards, chips, handleQuickReply, cardStyle, qRStyle, scriptStyle, lastMessageInSequence }) => (

    <>
        {speaker !== 'user' ?
            <div className="wrapper">

                {!cardStyle && !qRStyle && !scriptStyle ?
                    <div className="avatar-section">
                        <div className="avatar">
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
                                            header={card.structValue.fields.header.stringValue}
                                            link={card.structValue.fields.link.stringValue}
                                            price={card.structValue.fields.price.stringValue}
                                            image={card.structValue.fields.image.stringValue}
                                            description={card.structValue.fields.description.stringValue}
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
                                chips.map((chip, i) => {
                                    return <QuickReply
                                        key={i}
                                        text={chip.value}
                                        payload={chip.value ? chip.value : null}
                                        link={chip.link !== "" ? chip.link : null}
                                        reactLink={chip.reactLink ? chip.reactLink : null}
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
                <div className="wrapper">
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
