import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';


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

// sass
import './chatbot.styles.scss'
import './ie-chatbot.styles.scss'

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
class Chatbot extends React.Component {
  messagesEnd;
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      hidden: true,
      hideDots: true,
      menu: false,
      humanHandover: false,
      firstInteraction: true,
      showWelcomeMessage: false,
      showRestartMessage: false,
      disableInput: false,
      debug: false
    }

    if (cookies.get('userId') === undefined) {
      cookies.set('userId', uuid(), { path: '/' })
      cookies.set('firstTimeVisitor', "true", { path: '/' })
    } else {
      cookies.set('firstTimeVisitor', "false", { path: '/' })
    }
  }

  // method for adding delay
  resolveAfterXSeconds = (x) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000)
    })
  }

  componentDidMount = async () => {
    // show welcome message if it is the user's first visit.
    if (cookies.get('firstTimeVisitor') === "true") {
      setTimeout(() => {
        this.setState({ showWelcomeMessage: true })
      }, 3000)
    }

    // perform an event query of welcome when bot loads
    await this.eventQuery('Welcome');
  }

  componentDidUpdate = () => {
    if (!process.env.JEST_WORKER_ID) {
      // scroll to the bottom of the message window on
      // every new message
      this.messagesEnd.scrollIntoView({ behaviour: 'smooth' })
    }
  }

  _log = (debugOutput) => {
    if (this.state.debug) {
      console.log(debugOutput);
    }
  }

  // start a flex channel, add the user and 
  // add the channel handlers.
  initiateFlex = async () => {
    this._log("initiateFlex: ")
    const userId = cookies.get('userId');
    this._log("userId", userId);
    await flexInstance.initiate(userId, this.state.messages, (receivedMessage) => {  // Message added Handler
      this._log(receivedMessage);
      if (receivedMessage.type === "text" && receivedMessage.author !== userId) {
        let message = {
          speaker: formatName(receivedMessage.author),
          msg: receivedMessage.body
        }
        this.setState({ messages: [...this.state.messages, message] });
      }
    }, (agentLeftPayload) => { // agent left handler
      this.setState({ showRestartMessage: true })
    }, (agentJoinedPayload) => { // agent joined handler\
      const agentName = formatName(agentJoinedPayload.identity);
      let message = {
        info: agentName + " has joined the conversation."
      }
      this.setState({ messages: [...this.state.messages, message] });
    }, (typingPayload) => { // typing dots from agent handler\
      this.setState({ hideDots: false })
    }, (typingEndedPayload) => { // typing ended from agent handler\
      this.setState({ hideDots: true })
    });
    this._log("Token: " + flexInstance.token);
    this._log("Client: ", flexInstance.client);
    this._log("Channel: ", flexInstance.channel);

  }

  sendFlexMessage = async (messagetoSend) => {
    try {
      let message = {
        speaker: 'user',
        msg: messagetoSend
      }

      this.setState({ messages: [...this.state.messages, message] });
      await flexInstance.sendMessage(messagetoSend);

    } catch (error) {
      console.error(error)
    }
  }

  // make a request to the backend > dialogflow > voxa
  // and display the response appropriately by 
  // setting it to state.
  textQuery = async (text) => {

    try {
      let message = {
        speaker: 'user',
        msg: text
      }

      this.setState({ messages: [...this.state.messages, message] })

      const res = await axios.post(`${apiURL}/dialogflow/text_query`, { text, userId: cookies.get('userId') })
      const allMessages = []
      const botMessage = formatHyphens(res.data.intent_response)
      const status = res.data.status;
      const chips = status === "complete" ? null : res.data.chips && res.data.chips !== "none" ? res.data.chips : defaultChips;
      const cards = res.data.cards;

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

      this.setState({ messages: [...this.state.messages, ...allMessages] })

      // if the user has asked to talk to a human
      // check if they have already talked to a human
      // if they haven't hand them over
      // if they have reconfirm they need to restart
      // the chat.
      if (status === "complete") {

        if (flexInstance.initiated === false) {

          const userId = cookies.get('userId')
          const userInput = document.querySelector('.user-input')
          userInput.disabled = true


          const flexResponse = await this.initiateFlex();
          this._log(flexResponse);


          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ 'event': 'handover' });

          let handoverMessage = {
            info: "You are now being put in touch with a live agent. This can take up to 5 minutes, in the meantime please add as much information in the chat as you would like."
          }

          this.setState({ messages: [...this.state.messages, handoverMessage], humanHandover: true, hideDots: true });
          userInput.disabled = false
          userInput.focus()
          flexInstance.sendConnectedMessage(userId, "User is now connected");

        } else {
          let reloadMessage = {
            info: "Please restart the chat to continue your conversation with <%=chatbotName%> Bot.",
            restart: true
          }

          this.setState({ messages: [...this.state.messages, reloadMessage], hideDots: true, disableInput: true });
        }

      } else {
        this.setState({ hideDots: true })
      }

      // if this it the user's first message
      // push a datalayer of bot_used to log
      // that this user interacted with the bot
      if (this.state.firstInteraction === true) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'bot_used' });
        this.setState({ firstInteraction: false })
      }
    } catch (error) {
      let message = {
        error: true
      }

      this.setState({
        messages: [...this.state.messages, message],
        hideDots: true
      })
      console.error(error)
    }

  }

  // make a request to the backend > dialogflow > voxa
  // and display the response appropriately by 
  // setting it to state.
  eventQuery = async (event) => {
    try {
      const res = await axios.post(`${apiURL}/dialogflow/event_query`, { event, userId: cookies.get('userId') })
      const allMessages = []
      const botMessage = res.data.intent_response;
      const chips = res.data.chips;
      const cards = res.data.cards;

      this.setState({ hideDots: false })

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

      this.setState({
        messages: [...this.state.messages, ...allMessages],
        hideDots: true
      })
    } catch (error) {
      let message = {
        error: true
      }

      this.setState({
        messages: [...this.state.messages, message],
        hideDots: true
      })

      console.error(error)
    }

  }

  // method for printing messages in seperate bubbles
  // with delay.
  printMessageswithdelay = async (messages, messageToPrint) => {
    const messageAmount = messages.length

    if (messageToPrint === messageAmount) {
      this.setState({ hideDots: true })
      return
    } else {
      if (messageToPrint !== 0) {
        await this.resolveAfterXSeconds(2)
      }
      this.setState({ messages: [...this.state.messages, messages[messageToPrint]] })
      messageToPrint += 1
      this.printMessageswithdelay(messages, messageToPrint)
    }
  }

  // control how the messages coming from dialogflow or 
  // live chat are displayed.
  renderMessages = (stateMessages) => {
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
          return <Message key={i} speaker={message.speaker} chips={message.chips} handleQuickReply={this.handleQuickReply} qRStyle />
        }

      })
    } else {
      return null
    }
  }

  // handle when someone clicks a quick reply(chip)
  handleQuickReply = (text, payload) => {
    this.setState({ hideDots: false })
    this.textQuery(payload);
    document.querySelector('.user-input').focus()
  }

  // show or hide the bot
  toggleBot() {
    //  IE unable to handle animation, so commented out
    // const chatbot = document.querySelector('.chatbot') 
    // const  messagesContainer = document.querySelector('.messages-container')

    // if (chatbot && this.state.hidden === false) {
    //   chatbot.classList = 'chatbot disappear';
    //   messagesContainer.classList = 'messages-container disappear';
    //   await this.resolveAfterXSeconds(.4) 
    // }

    this.setState({ hidden: !this.state.hidden }, () => {
      window.dataLayer = window.dataLayer || [];
      if (this.state.hidden) {
        window.dataLayer.push({ 'event': 'bot_closed' });
      } else {
        window.dataLayer.push({ 'event': 'bot_open' });
      }
    })
  }

  toggleMenu = () => {
    this.setState({
      menu: !this.state.menu
    })
  }

  closeWelcomeMessage = () => {
    this.setState({ showWelcomeMessage: false })
  }

  restartChat = () => {
    window.location.reload(false);
  }


  // handle when a user presses send or enter. 
  handleSubmit = async (e) => {
    e.preventDefault()
    let submission = e.target.children[0]
    if (submission.value !== '') {
      if (this.state.humanHandover === false) {
        this.setState({ hideDots: false })
        this.textQuery(submission.value)
        submission.value = ''
        submission.focus()
      } else {
        this.sendFlexMessage(submission.value)
        submission.value = ''
        submission.focus()
      }
    } else {
      return
    }
  }

  // display the bot.
  render() {
    const {
      messages,
      hideDots,
      hidden,
      menu,
      disableInput,
      showWelcomeMessage,
      showRestartMessage
    } = this.state

    if (hidden) {
      return (
        <>
          {
            customWelcomeMessage && showWelcomeMessage ?
              <WelcomeMessage welcomeMessage={customWelcomeMessage} closeWelcomeMessage={this.closeWelcomeMessage} />
              :
              null
          }

          <div className="chatbot-button chatbot-button-hidden" onClick={() => this.toggleBot()} >
            {chatbotButton}
            <div ref={(el) => this.messagesEnd = el}></div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="chatbot-button" onClick={() => this.toggleBot()} >{closeIcon}</div>
          <div className="widget">
            <div className="chatbot">
              {
                showRestartMessage ?
                  <RestartPopup />
                  :
                  null
              }
              <div className="main-title">
                <div className="logo-section">
                  <div className="logo" alt="logo" />
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
                      <p className="header-button header-button-close" onClick={() => getInjectionScript()}>
                        Injection Script
                            </p> : null
                  }
                  <div className="header-button header-button-menu" alt="download" onClick={this.toggleMenu}>{menuButton}</div>
                  <div className="header-button header-button-close" onClick={() => this.toggleBot()}>{closeIcon}</div>
                  {/* <img className="header-button" src={`${deployedURL}/img/download.png`} alt="download" onClick={this.downloadConversation}/> */}
                </div>
              </div>
              {
                menu ?
                  <Menu>
                    <MenuItem
                      image={printIcon}
                      functionName={printConversation}
                      title="Print Conversation"
                    />
                    <MenuItem
                      image={endConversationIcon}
                      functionName={this.restartChat}
                      title="End Conversation"
                    />
                  </Menu>
                  : null
              }
              <div className="messages-container">

                {
                  messages.length > 0 ?
                    this.renderMessages(messages)
                    : <Spinner />
                }
                {
                  hideDots ?
                    null :
                    <TypingDots />
                }

                <div ref={(el) => this.messagesEnd = el}></div>
              </div>

              {
                disableInput ?
                  null :
                  <form className="input-form" onSubmit={this.handleSubmit}>
                    <input type="text" onChange={(e) => changeButtonStyles(e)} placeholder="Send a message..." className="user-input" />
                    {/* <button className="input-buttons" onClick={handleUpload} type="button">{paperclip}</button> */}
                    <button type="submit" className="submit">{sendButton}</button>
                  </form>
              }

            </div>
          </div>
        </>
      )
    }

  }
}

export default Chatbot;