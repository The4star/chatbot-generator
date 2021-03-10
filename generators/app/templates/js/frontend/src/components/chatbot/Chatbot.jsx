import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

// state
import { BotStateContext, BotDispatchContext } from '../../state/bot/BotStateProvider'

// components
import WelcomeMessage from './WelcomeMessage/WelcomeMessage';
import RestartPopup from './RestartPopup/RestartPopup';
import Message from './Message/Message';
import InfoPopup from './InfoPopup/InfoPopup';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import TypingDots from './TypingDots/TypingDots';
import Menu from './Menu/Menu';
import MenuItem from './Menu/MenuItem/MenuItem';
import Spinner from './Spinner/Spinner';

// functions
import {
  getInjectionScript,
  printConversation,
  isDeployedSite,
  changeButtonStyles,
  formatName,
  formatHyphens
} from '../../functions/general-functions'

// flex 
import Flex from '../../twilio/flex'

// site where live chat bot is deployed set in src/helpers/deployed-url
import {
  // deployedURL, 
  apiURL,
  customWelcomeMessage,
  defaultChips
} from '../../helpers/variables'

// svg
import {
  // paperclip, 
  sendButton,
  chatbotButton,
  closeIcon,
  menuButton,
  printIcon,
  endConversationIcon
} from '../../img/img-variables'

const cookies = new Cookies();
const flexInstance = new Flex(false); // change to true to turn on debug messages

// chatbot component
const Chatbot = () => {
  let messagesEnd;
  const debug = false;
  const state = useContext(BotStateContext);
  const dispatch = useContext(BotDispatchContext);
  const {
    messages,
    showBot,
    showDots,
    showMenu,
    showWelcomeMessage,
    humanHandover,
    showRestartMessage,
    disableInput,
    firstInteraction
  } = state

  const _log = (debugOutput) => {
    if (debug) {
      console.log(debugOutput);
    }
  }

  // start a flex channel, add the user and 
  // add the channel handlers.
  const initiateFlex = async () => {
    _log("initiateFlex: ")
    const userId = cookies.get('userId');
    _log("userId", userId);
    await flexInstance.initiate(userId, messages, (receivedMessage) => {  // Message added Handler
      _log(receivedMessage);
      if (receivedMessage.type === "text" && receivedMessage.author !== userId) {
        let message = {
          speaker: formatName(receivedMessage.author),
          msg: receivedMessage.body
        }
        dispatch({ type: "updateMessages", messages: [message] })
      }
    }, (agentLeftPayload) => { // agent left handler
      dispatch({ type: "setShowRestartMessage", showRestartMessage: true })
    }, (agentJoinedPayload) => { // agent joined handler\
      const agentName = formatName(agentJoinedPayload.identity);
      let message = {
        info: agentName + " has joined the conversation."
      }
      dispatch({ type: "updateMessages", messages: [message] })
    }, (typingPayload) => { // typing dots from agent handler\
      dispatch({ type: "showDots", showDots: true })
    }, (typingEndedPayload) => { // typing ended from agent handler\
      dispatch({ type: "showDots", showDots: false })
    });
    _log("Token: " + flexInstance.token);
    _log("Client: ", flexInstance.client);
    _log("Channel: ", flexInstance.channel);
  }

  const sendFlexMessage = async (messagetoSend) => {
    try {
      let message = {
        speaker: 'user',
        msg: messagetoSend
      }
      dispatch({ type: "updateMessages", messages: [message] })
      await flexInstance.sendMessage(messagetoSend);
    } catch (error) {
      console.error(error)
    }
  }

  const formatMessages = (messages, allMessages) => {
    const { botMessage, chips, cards } = messages
    if (botMessage) {
      let message = {
        speaker: '<%=chatbotName%> Bot',
        msg: botMessage
      }
      allMessages.push(message)
    }
    // add card message
    if (cards) {
      let message = {
        speaker: '<%=chatbotName%> Bot',
        cards: cards
      }
      allMessages.push(message)
    }
    // add quick reply message
    if (chips) {
      let message = {
        speaker: '<%=chatbotName%> Bot',
        chips: chips
      }
      allMessages.push(message)
    }
  }

  // make a request to the backend > dialogflow > voxa
  // and display the response appropriately by 
  // setting it to state.
  const textQuery = async (text) => {
    try {
      let message = {
        speaker: 'user',
        msg: text
      }

      dispatch({ type: "updateMessages", messages: [message] })

      const res = await axios.post(`${apiURL}/dialogflow/text_query`, { text, userId: cookies.get('userId') })
      const allMessages = []
      const botMessage = formatHyphens(res.data.intentResponse)
      const status = res.data.status;
      const chips = status === "complete" ? null : res.data.chips && res.data.chips !== "none" ? res.data.chips : defaultChips;
      const cards = res.data.cards;

      formatMessages({ botMessage, chips, cards }, allMessages);
      dispatch({ type: "updateMessages", messages: allMessages })

      // if the user has asked to talk to a human
      // check if they have already talked to a human
      // if they haven't hand them over
      // if they have reconfirmed they need to restart
      // the chat.
      if (status === "complete") {

        if (flexInstance.initiated === false) {
          const userId = cookies.get('userId')
          const userInput = document.querySelector('.user-input')
          userInput.disabled = true
          const flexResponse = await initiateFlex();
          _log(flexResponse);

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ 'event': 'handover' });

          let handoverMessage = {
            info: "You are now being put in touch with a live agent. This can take up to 5 minutes, in the meantime please add as much information in the chat as you would like."
          }
          dispatch({ type: "updateMessages", messages: [handoverMessage] })
          dispatch({ type: "setHumanHandover", humanHandover: true })
          dispatch({ type: "showDots", showDots: false })
          userInput.disabled = false
          userInput.focus()
          flexInstance.sendConnectedMessage(userId, "User is now connected");

        } else {
          let reloadMessage = {
            info: "Please restart the chat to continue your conversation with <%=chatbotName%> Bot.",
            restart: true
          }
          dispatch({ type: "updateMessages", messages: [reloadMessage] })
          dispatch({ type: "showDots", showDots: false })
          dispatch({ type: "setDisableInput", disableInput: true })
        }
      } else {
        dispatch({ type: "showDots", showDots: false })
      }
      // if this it the user's first message
      // push a datalayer of bot_used to log
      // that this user interacted with the bot
      if (firstInteraction === true) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'bot_used' });
        dispatch({ type: "setFirstInteraction", firstInteraction: true });
      }
    } catch (error) {
      let message = {
        error: true
      }

      dispatch({ type: "updateMessages", messages: [message] })
      dispatch({ type: "showDots", showDots: false })
      console.error(error)
    }

  }

  // make a request to the backend > dialogflow > voxa
  // and display the response appropriately by 
  // setting it to state.
  const eventQuery = async (event) => {
    try {
      const res = await axios.post(`${apiURL}/dialogflow/event_query`, { event, userId: cookies.get('userId') })
      const allMessages = []
      const botMessage = res.data.intentResponse;
      const chips = res.data.chips;
      const cards = res.data.cards;

      dispatch({ type: "showDots", showDots: true })

      formatMessages({ botMessage, chips, cards }, allMessages);
      dispatch({ type: "updateMessages", messages: allMessages })
      dispatch({ type: "showDots", showDots: false })
    } catch (error) {
      let message = {
        error: true
      }
      dispatch({ type: "updateMessages", messages: [message] })
      dispatch({ type: "showDots", showDots: false })
      console.error(error)
    }
  }

  // control how the messages coming from dialogflow or 
  // live chat are displayed.
  const renderMessages = (stateMessages) => {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        if (message.msg) {
          return <Message key={i} speaker={message.speaker} text={message.msg} />
        } else if (message.cards) {
          return <Message key={i} speaker={message.speaker} cards={message.cards} cardStyle />
        } else if (message.info) {
          return message.restart ? <InfoPopup key={i} message={message.info} restart /> : <InfoPopup key={i} message={message.info} />
        } else if (message.error) {
          return <ErrorMessage />
        } else if (message.script) {
          return <Message key={i} speaker={message.speaker} text={message.script} scriptStyle />
        } else {
          return <Message key={i} speaker={message.speaker} chips={message.chips} handleQuickReply={handleQuickReply} qRStyle />
        }
      })
    } else {
      return null
    }
  }

  // handle when someone clicks a quick reply(chip)
  const handleQuickReply = (text, payload) => {
    dispatch({ type: "showDots", showDots: true })
    textQuery(payload);
    document.querySelector('.user-input').focus()
  }

  const restartChat = () => {
    window.location.reload(false);
  }

  // handle when a user presses send or enter. 
  const handleSubmit = async (e) => {
    e.preventDefault()
    let submission = e.target.children[0]
    if (submission.value !== '') {
      if (humanHandover === false) {
        dispatch({ type: "showDots", showDots: true })
        textQuery(submission.value)
        submission.value = ''
        submission.focus()
      } else {
        sendFlexMessage(submission.value)
        submission.value = ''
        submission.focus()
      }
    } else {
      return
    }
  }

  useEffect(() => {
    // show welcome message if it is the user's first visit.
    if (cookies.get('userId') === undefined) {
      cookies.set('userId', uuid(), { path: '/' })
      setTimeout(() => {
        dispatch({ type: "toggleWelcomeMessage" })
      }, 3000)
    }
    const getWelcome = async () => {
      // perform an event query of welcome when bot loads
      await eventQuery('Welcome');
    }
    getWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!process.env.JEST_WORKER_ID) {
      /**
       * scroll to the bottom of the message window on
       * every new message
       */
      messagesEnd.scrollIntoView({ behaviour: 'smooth' })
    }
  })

  if (!showBot) {
    return (
      <>
        {
          customWelcomeMessage && showWelcomeMessage ?
            <WelcomeMessage welcomeMessage={customWelcomeMessage} closeWelcomeMessage={dispatch({ type: "toggleWelcomeMessage" })} />
            :
            null
        }
        <div className="chatbot-button chatbot-button-hidden" onClick={() => dispatch({ type: "toggleBot" })} >
          {chatbotButton}
          <div ref={(el) => messagesEnd = el}></div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="chatbot-button" onClick={() => dispatch({ type: "toggleBot" })} >{closeIcon}</div>
        <div className="chatbot">
          {
            showRestartMessage ?
              <RestartPopup />
              :
              null
          }
          <div className="chatbot__main-title">
            <div className="logo-section">
              <div className="logo-section__logo" alt="logo" />
              <div className="title-text">
                <h4>
                  <%=chatbotName%>
                          </h4>
                <p>
                  Virtual Assistant
                          </p>
              </div>
            </div>

            <div className="buttons">
              {
                isDeployedSite() ?
                  <p className="header-button" onClick={() => getInjectionScript()}>
                    Injection Script
                            </p> : null
              }
              <div className="header-button" alt="download" onClick={() => dispatch({ type: "toggleMenu" })}>{menuButton}</div>
              <div className="header-button" onClick={() => dispatch({ type: "toggleBot" })}>{closeIcon}</div>
              {/* <img className="header-button" src={`${deployedURL}/img/download.png`} alt="download" onClick={this.downloadConversation}/> */}
            </div>
          </div>
          {
            showMenu ?
              <Menu>
                <MenuItem
                  image={printIcon}
                  functionName={printConversation}
                  title="Print Conversation"
                />
                <MenuItem
                  image={endConversationIcon}
                  functionName={restartChat}
                  title="End Conversation"
                />
              </Menu>
              : null
          }
          <div className="messages-container">

            {
              messages.length > 0 ?
                renderMessages(messages)
                : <Spinner />
            }
            {
              showDots ?
                <TypingDots />
                : null
            }

            <div ref={(el) => messagesEnd = el}></div>
          </div>

          {
            disableInput ?
              null :
              <form className="input-form" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => changeButtonStyles(e)} placeholder="Send a message..." className="input-form__user-input" />
                {/* <button className="input-buttons" onClick={handleUpload} type="button">{paperclip}</button> */}
                <button type="submit" className="input-form__submit">{sendButton}</button>
              </form>
          }

        </div>
      </>
    )
  }
}

export default Chatbot;