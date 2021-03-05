import axios from 'axios';
import { apiURL } from '../helpers/variables'
import * as Chat from 'twilio-chat'

class Flex { 

    constructor(debug) {
        if(!debug) debug = false;
        this.debug = debug;
        this.initiated = false;
    }

    initiate = async (userId, messageHistory, messageHandler, memberLeft, memberJoined, typing, typingEnded) => {

        // Request Twilio Token and Flex Channel from server
        const res = await axios.post(`${apiURL}/twilio/init`, {userId, messageHistory});
        if(this.debug) console.log("response data", res.data);
        this.token = res.data.token;
        if(this.debug) console.log("this.token", this.token);
        this.flexChannel = res.data.flexChannel;
        if(this.debug) console.log("this.flexChannel", this.flexChannel);

        // Initialize Twilio Chat (starts websocket)
        this.client = await Chat.Client.create(this.token);
        if(this.debug) console.log("this.client", this.client);

        // Double check user values match those from created channel
        this.user = await this.client.getUser(userId);
        if(this.debug) console.log("this.user", this.user); 
        if(this.debug) console.log("this.user.identity", this.user.identity); 
        if(this.debug) console.log("this.user.state.entityName", this.user.state.entityName); 
        if(this.user.identity !== userId) {
            console.error("User identity mismatch");
        }

        // Double check user is subscribed to the newly created Flex Enabled Chat Channel
        this.subscribedChannels = await this.client.getSubscribedChannels();
        if(this.debug) console.log("this.subscribedChannels", this.subscribedChannels);
        // TODO: double check newly created channel is in subscribed channels array

        // Create the Chat Channel object
        this.channel = await this.client.getChannelBySid(this.flexChannel.sid);
        if(this.debug) console.log("this.channel", this.channel);
        
        // set the channel to initiated.
        this.initiated = true;

        // Set up new message handler for receiving messages from the agent
        this.channel.on('messageAdded', (message) => {
            messageHandler(message);
          });
        //   inform user agent has left
        this.channel.on('memberLeft', payload => {
            memberLeft(payload);
        });
        //inform user agent has joined
        this.channel.on('memberJoined', payload => {
            memberJoined(payload);
        });
        //show user typing dots if the agent is typing
        this.channel.on('typingStarted', payload => {
            typing(payload)
        })
        //hide the typing dots from the user if the agent finishes typing.
        this.channel.on('typingEnded', payload => {
            typingEnded(payload)
        })
        
        return true;
    }

    sendMessage = async (messageToSend) => {
        const sentMessage = await this.channel.sendMessage(messageToSend);
        if(this.debug) console.log(sentMessage);
        return sentMessage;
    }
    
    sendConnectedMessage = async (userId, messageToSend) => {
        const res = await axios.post(`${apiURL}/twilio/connected`, {userId, message: messageToSend});
        if(this.debug) console.log(res.data);
    }


}

export default Flex;