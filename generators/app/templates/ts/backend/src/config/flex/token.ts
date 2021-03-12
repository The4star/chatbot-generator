const generateToken = async (userId: string | number) => {
  const AccessToken = require('twilio').jwt.AccessToken;
  const ChatGrant = AccessToken.ChatGrant;

  // Used when generating any kind of tokens
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  // Used specifically for creating Chat tokens
  const serviceSid = process.env.TWILIO_FLEX_CHAT_SERVICE;
  const identity = userId;

  // Create a "grant" which enables a client to use Chat as a given user,
  // on a given device
  const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
    endpointId: "FlexChat:" + userId + ":demo-device"
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  let token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);

  token.addGrant(chatGrant);

  token.identity = identity;

  if (process.env.DEBUG) console.log("token", token);
  const jwt = token.toJwt();

  // Serialize the token to a JWT string
  return jwt;
}

// // generateToken();
// sendMessage();

export {
  generateToken
}