# Versa Chat bot - Custom UI
## React Front end and Express back end connection to Twilio Flex and Dialogflow for Versa Chatbot UI Generator.

To start the backend.
`cd backend`
`yarn dev`

To start the frontend. 
`cd frontend`
`yarn start`

## Develop Locally

In order to develop locally you will need to go to `backend/config.chatbot.js` and uncomment the below lines of code. 

![uncomment these lines.](./readme-images/uncomment.png "Uncomment these lines")

you will also need a .env file with the following, **if you have access to the google cloud project you can retrieve these values from the config of the app engine instance**: 

```.env

GOOGLE_CLIENT_EMAIL= {email from your dialogflow integrations service account}
GOOGLE_PRIVATE_KEY= {private key from your dialogflow integrations service account}
GOOGLE_PROJECT_ID= {project id from your dialogflow integrations service account}
DIALOGFLOW_SESSION_ID=versa
DIALOGFLOW_SESSION_LANGUAGE_CODE=en
TWILIO_ACCOUNT_SID= {retrieve from twilio project}
TWILIO_FLEX_FLOW_SID= {retrieve from twilio project}
TWILIO_FLEX_CHAT_SERVICE= {retrieve from twilio project}
TWILIO_AUTH_TOKEN= {retrieve from twilio project}
TWILIO_API_KEY= {retrieve from twilio project}
TWILIO_API_SECRET= {retrieve from twilio project}
TWILIO_SERVICE_SID= {retrieve from twilio project}

```

### Change styles

Change the style variables in `src/style-variables.scss`

### Change Variables

You can change the Api and Deployed URL's as well as the welcome message in `src/helpers`.

### Functionality

You will find the main functionality and rendering of the chatbot in `src/components/chatbot/chatbot.component.jsx.`

## Created By
| company: <%=companyName%>
