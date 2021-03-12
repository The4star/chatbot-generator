const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const { v4: uuidv4 } = require('uuid');

class Flex {
  public debug: boolean;
  public client: any;
  public channel: any;
  public flexFlow: any;

  constructor(debug: boolean) {
    if (!debug) debug = false;
    this.debug = debug;
    this.client = require('twilio')(accountSid, authToken);
  }

  // Create a channel for this chat session with the user
  async createChannel(userId: string, targetId: string | number) {
    if (this.debug) console.log('targetId', targetId);
    if (this.debug) console.log('userId', userId);

    if (!userId) userId = uuidv4();
    if (!targetId) targetId = uuidv4();

    try {
      if (this.debug) console.log("attempt to create channel");
      this.channel = await this.client.flexApi.channel
        .create({
          target: targetId,
          identity: userId,
          chatUserFriendlyName: 'Web Visitor',
          chatFriendlyName: 'Flex WebChat',
          flexFlowSid: process.env.TWILIO_FLEX_FLOW_SID
        });

    } catch (err) {
      console.error(err);
    }


    if (this.debug) console.log('channel', this.channel);
    return this.channel;

  }

  // Create a custom flex flow channel (required when not using the out of the box Flex Webchat UI)
  // Only required once as a set up task, not used during regular user interactions
  async createFlexFlow() {
    try {

      this.flexFlow = await this.client.flexApi.flexFlow
        .create({
          integrationType: 'task',
          enabled: true,
          // contactIdentity: 'FO5f1f2b9ed2c4bc83d9bb219695612494',
          integration: {
            workspaceSid: '', //insert workspace sid here. 
            workflowSid: '', //insert workflowsid here.
            // channel: 'default',
            // timeout: 3600,
            // priority: 0,
            creationOnMessage: false,
            // retryCount: 0
          },
          friendlyName: 'Custom Flex WebChat Channel Flow',
          channelType: 'web',
          chatServiceSid: process.env.TWILIO_FLEX_CHAT_SERVICE,
          longLived: true
        });
      if (this.debug) console.log('flexFlow', this.flexFlow);
      return this.flexFlow;
    } catch (err) {
      console.error(err);
    }

  }

  // List Flex Flows that have been created.  
  async listFlexFlows() {
    try {
      const flows = await this.client.flexApi.flexFlow.list({ limit: 20 });
      if (this.debug) console.log('flows', flows);
      return flows;
    } catch (err) {
      console.error(err);
    }
  }

  // Send message to the existing chat channel and service
  //  This sends the messages to the message thread in Twilio, the Agent will see this message as a message from "system"
  async sendMessage(messageToSend: string) {

    try {

      const message = await this.client.chat.services(process.env.TWILIO_FLEX_CHAT_SERVICE)
        .channels(this.channel.sid)
        .messages
        .create();

      if (this.debug) console.log('message', message);

      const updatedMessage = await message.update({ body: messageToSend });

      if (this.debug) console.log('updated message', updatedMessage);

      return { success: true, message: updatedMessage };

    } catch (err) {
      console.error(err);
      return { success: false };
    }

  }
}

export {
  Flex
}
