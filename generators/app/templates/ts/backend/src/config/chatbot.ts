import { v2, SessionsClient, protos } from '@google-cloud/dialogflow'
import { IDialogflowQueryResponseChip, IDialogflowQueryResponseCard, IDialogflowQueryResponse } from '../types/Dialogflow.types';
const structjson = require('structjson');

// keys
import keys from './keys'
const { googleProjectID, dialogFlowSessionID, dialogFlowSessionLanguageCode, googleClientEmail, googlePrivateKey } = keys;

const credentials = {
    client_email: googleClientEmail,
    private_key: googlePrivateKey
}

const sessionClient: v2.SessionsClient = new SessionsClient({
    projectId: googleProjectID,
    credentials
});


// performs a text query to dialogflow
const textQuery = async (text: string, userId: string, payload: protos.google.protobuf.IStruct | null = null): Promise<IDialogflowQueryResponse> => {
    let sessionPath = sessionClient.projectAgentSessionPath(googleProjectID!, dialogFlowSessionID + userId);

    const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
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
            payload
        }
    };

    // get the response from dialogflow and format the chips
    // and messages to be easily ingestible by the front end. 
    let response = await sessionClient.detectIntent(request);
    const { chips, cards } = sortChipsAndCards(response)
    const state = response[0].queryResult!.webhookPayload && response[0].queryResult!.webhookPayload.fields!.state.stringValue;
    const result = response[0].queryResult
    const messages = result!.fulfillmentMessages![0].text!.text;
    const intentResponse = messages!.map((message: string) => message).join("\n\n");
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
        chips: chips ? chips : null,
        cards: cards ? cards : null
    } as IDialogflowQueryResponse;
}

// performs an event query to dialogflow
const eventQuery = async (event: string, userId: string, parameters = {}): Promise<IDialogflowQueryResponse> => {
    let sessionPath = sessionClient.projectAgentSessionPath(googleProjectID!, dialogFlowSessionID + userId)

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
    const { chips, cards } = sortChipsAndCards(response)
    const state = response[0].queryResult!.webhookPayload && response[0].queryResult!.webhookPayload.fields!.state.stringValue;
    const result = response[0].queryResult
    const messages = result!.fulfillmentMessages![0].text!.text;
    const intentResponse = messages!.map((message: string) => message).join("\n\n");
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
        chips: chips ? chips : null,
        cards: cards ? cards : null
    } as IDialogflowQueryResponse;
}

const sortChipsAndCards = (response: any): { chips: IDialogflowQueryResponseChip[], cards: IDialogflowQueryResponseCard[] } => {
    let cards
    const chips = response[0].queryResult.fulfillmentMessages[1] &&
        response[0].queryResult.fulfillmentMessages[1].payload &&
        response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields.options &&
        response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields.options.listValue.values.map((chip: any) => {
            return {
                value: chip.structValue.fields.text.stringValue,
                link: chip.structValue.fields.link ? chip.structValue.fields.link.stringValue : ""
            }
        })

    if (!chips) {
        cards = response[0].queryResult.fulfillmentMessages[1] &&
            response[0].queryResult.fulfillmentMessages[1].payload &&
            response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values &&
            response[0].queryResult.fulfillmentMessages[1].payload.fields.richContent.listValue.values[0].listValue.values.map((card: any) => {
                const cardValues = card.structValue.fields
                return {
                    title: cardValues.title.stringValue,
                    subtitle: cardValues.subtitle.stringValue,
                    link: cardValues.actionLink.stringValue,
                    image: cardValues.image.structValue.fields.src.structValue.fields.rawURL.stringValue
                }
            })
    } else {
        cards = null
    }
    return {
        chips,
        cards
    }
}

export {
    textQuery,
    eventQuery
}
