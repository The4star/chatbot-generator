const dialogflow = require('dialogflow');
const structjson = require('structjson');

// keys
const { googleProjectID, dialogFlowSessionID, dialogFlowSessionLanguageCode, googleClientEmail, googlePrivateKey } = require('./keys')

const credentials = {
    client_email: googleClientEmail,
    private_key: googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({
    projectId: googleProjectID,
    credentials
});


// performs a text query to dialogflow
const textQuery = async (text, userId, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID + userId)
    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
            },
        },
        queryParams: {
            payload: {
                data: parameters
            }
        }
    };

    // get the response from dialogflow and format the chips
    // and messages to be easily ingestible by the front end. 
    let response = await sessionClient.detectIntent(request);
    const chips = response[0].queryResult.fulfillmentMessages[1] && response[0].queryResult.fulfillmentMessages[1].payload && response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields.options.listValue.values.map(chip => {
        return { value: chip.structValue.fields.text.stringValue, link: chip.structValue.fields.link ? chip.structValue.fields.link.stringValue : "" }
    })
    const state = response[0].queryResult.webhookPayload && response[0].queryResult.webhookPayload.fields.state.stringValue;
    const result = response[0].queryResult
    const messages = result.fulfillmentMessages[0].text.text;
    const intentResponse = messages.map(message => message).join("\n\n");
    // Set function response status
    let status;
    if (state === "Exit") {
        status = 'complete';
    } else {
        status = 'in-progress';
    }

    return {
        status,
        intentResponse,
        chips: chips ? chips : false
    };
}

// performs an event query to dialogflow
const eventQuery = async (event, userId, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID + userId)
    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
            },
        },
    };

    // get the response from dialogflow and format the chips
    // and messages to be easily ingestible by the front end. 
    let response = await sessionClient.detectIntent(request);
    const chips = response[0].queryResult.fulfillmentMessages[1] && response[0].queryResult.fulfillmentMessages[1].payload && response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields.options.listValue.values.map(chip => {
        return { value: chip.structValue.fields.text.stringValue, link: chip.structValue.fields.link ? chip.structValue.fields.link.stringValue : "" }
    })
    const state = response[0].queryResult.webhookPayload && response[0].queryResult.webhookPayload.fields.state.stringValue;
    const result = response[0].queryResult
    const messages = result.fulfillmentMessages[0].text.text;
    const intentResponse = messages.map(message => message).join("\n\n");
    // Set function response status
    let status;
    if (state === "Exit") {
        status = 'complete';
    } else {
        status = 'in-progress';
    }

    return {
        status,
        intentResponse,
        chips: chips ? chips : false
    };
}

module.exports = {
    textQuery,
    eventQuery
}
