import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import {
  setDisableInput,
  setFirstInteraction,
  setHumanHandover,
  setNotification,
  setShowDots,
  setShowRestartMessage,
  toggleBot,
  toggleMenu,
  updateMessages
} from '../../state/bot/bot.state'

// components
import Notification from './Notification/Notification';
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

  // state
  const dispatch = useDispatch()
  const messages = useSelector(state => state.bot.messages);
  const showBot = useSelector(state => state.bot.showBot);
  const showDots = useSelector(state => state.bot.showDots);
  const notification = useSelector(state => state.bot.notification);
  const humanHandover = useSelector(state => state.bot.humanHandover);
  const disableInput = useSelector(state => state.bot.disableInput);
  const firstInteraction = useSelector(state => state.bot.firstInteraction);
  const showRestartMessage = useSelector(state => state.bot.showRestartMessage);
  const showMenu = useSelector(state => state.bot.showMenu)

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
    _log("userId:" + userId);
    await flexInstance.initiate(userId, messages, (receivedMessage) => {  // Message added Handler
      _log(receivedMessage);
      if (receivedMessage.type === "text" && receivedMessage.author !== userId) {
        let message = {
          speaker: formatName(receivedMessage.author),
          msg: receivedMessage.body
        }
        dispatch(updateMessages([message]))
      }
    }, (agentLeftPayload) => { // agent left handler
      dispatch(setShowRestartMessage(true))
    }, (agentJoinedPayload) => { // agent joined handler\
      const agentName = formatName(agentJoinedPayload.identity);
      let message = {
        info: agentName + " has joined the conversation."
      }
      dispatch(updateMessages([message]))
    }, (typingPayload) => { // typing dots from agent handler\
      dispatch(setShowDots(true))
    }, (typingEndedPayload) => { // typing ended from agent handler\
      dispatch(setShowDots(false))
    });
    _log("Token: " + flexInstance.token);
    _log("Client: " + flexInstance.client);
    _log("Channel: " + flexInstance.channel);
  }

  const sendFlexMessage = async (messagetoSend) => {
    try {
      let message = {
        speaker: 'user',
        msg: messagetoSend
      }
      dispatch(updateMessages([message]))
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
        speaker: '<%=chatbotName%>  Bot',
        cards: cards
      }
      allMessages.push(message)
    }
    // add quick reply message
    if (chips) {
      let message = {
        speaker: '<%=chatbotName%>  Bot',
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

      dispatch(updateMessages([message]))

      const res = await axios.post(`${apiURL}/dialogflow/text_query`, { text, userId: cookies.get('userId') })
      const allMessages = []
      const botMessage = formatHyphens(res.data.intentResponse)
      const status = res.data.status;
      const chips = status === "complete" ? null : res.data.chips ? res.data.chips : defaultChips;
      const cards = res.data.cards;

      formatMessages({ botMessage, chips, cards }, allMessages);
      dispatch(updateMessages(allMessages))

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
          dispatch(updateMessages([handoverMessage]))
          dispatch(setHumanHandover(true))
          dispatch(setShowDots(false))
          userInput.disabled = false
          userInput.focus()
          flexInstance.sendConnectedMessage(userId, "User is now connected");

        } else {
          let reloadMessage = {
            info: "Please restart the chat to continue your conversation with <%=chatbotName%> Bot.",
            restart: true
          }
          dispatch(updateMessages([reloadMessage]))
          dispatch(setShowDots(false))
          dispatch(setDisableInput(true))
        }
      } else {
        dispatch(setShowDots(false))
      }
      // if this it the user's first message
      // push a datalayer of bot_used to log
      // that this user interacted with the bot
      if (firstInteraction === true) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'bot_used' });
        dispatch(setFirstInteraction(true))
      }
    } catch (error) {
      let message = {
        error: true
      }

      dispatch(updateMessages([message]))
      dispatch(setShowDots(false))
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

      dispatch(setShowDots(true))

      formatMessages({ botMessage, chips, cards }, allMessages);
      dispatch(updateMessages(allMessages))
      dispatch(setShowDots(false))
    } catch (error) {
      let message = {
        error: true
      }
      dispatch(updateMessages([message]))
      dispatch(setShowDots(false))
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
          return <InfoPopup key={i} message={message.info} />
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
  const handleQuickReply = (payload) => {
    dispatch(setShowDots(true))
    textQuery(payload);
    const userInput = document.querySelector('.input-form__user-input');
    userInput.focus()
  }

  const restartChat = () => {
    window.location.reload();
  }

  // handle when a user presses send or enter. 
  const handleSubmit = async (event) => {
    event.preventDefault()
    let submission = event.currentTarget.children[0];
    const query = submission.value;
    if (query !== '') {
      if (humanHandover === false) {
        dispatch(setShowDots(true))
        submission.value = ''
        await textQuery(query)
        submission.focus()
      } else {
        submission.value = ''
        await sendFlexMessage(query)
        submission.focus()
      }
    } else {
      return
    }
  }

  useEffect(() => {
    const chatbotButton = document.querySelector('.chatbot-button')
    const updateDataLayer = () => {
      window.dataLayer = window.dataLayer || [];
      if (showBot === true) {
        if (window.dataLayer.length) {
          window.dataLayer.push({ 'event': 'bot_closed' });
        }
      } else {
        window.dataLayer.push({ 'event': 'bot_open' });
      }
    }
    chatbotButton.addEventListener('click', updateDataLayer);
    return () => {
      chatbotButton.removeEventListener('click', updateDataLayer);
    }
  }, [showBot])

  useEffect(() => {
    // show welcome message if it is the user's first visit.
    if (cookies.get('userId') === undefined) {
      cookies.set('userId', uuid(), { path: '/' })
      setTimeout(() => {
        dispatch(setNotification(customWelcomeMessage))
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
      messagesEnd.scrollIntoView({ behavior: 'smooth' })
    }
  })

  if (!showBot) {
    return (
      <>
        {
          notification ?
            <Notification message={notification} closeNotification={() => dispatch(setNotification(null))} />
            :
            null
        }
        <div className="chatbot-button chatbot-button-hidden" onClick={() => dispatch(toggleBot())} >
          {chatbotButton}
          <div ref={(el) => messagesEnd = el}></div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="chatbot-button" onClick={() => dispatch(toggleBot())} >{closeIcon}</div>
        <div className="chatbot">
          {
            showRestartMessage ?
              <RestartPopup />
              :
              null
          }
          <div className="chatbot__main-title">
            <div className="logo-section">
              <div className="logo-section__logo" />
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
              <div className="header-button" onClick={() => dispatch(toggleMenu())}>{menuButton}</div>
              <div className="header-button" onClick={() => dispatch(toggleBot())}>{closeIcon}</div>
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
                {/* <button className="input-buttons" onClick={handleUpload} type="button"><PaperClip /></button> */}
                <button type="submit" className="input-form__submit">{sendButton}</button>
              </form>
          }

        </div>
      </>
    )
  }
}

export default Chatbot;