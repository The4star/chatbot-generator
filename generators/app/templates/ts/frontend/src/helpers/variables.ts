const deployedURL = "";
const apiURL = "http://localhost:5000";
const channelName = "DEV WebChat"; // used for Twilio Flex
const uniqueNamePrefix = "dev"; // used for Twilio Flex
const customWelcomeMessage = "Hi, i'm the versa chatbot UI. \n\n Checkout the readme in the parent folder of the repository to learn how to get me connected and styled!"; // make null to have no welcome message
const defaultChips = null // uncomment these to have default chips [{value: "What services do you provide?", link: ""}, {value: "Where are your stores?", link: ""},{value: "Past clients", link:""}];

export { deployedURL, apiURL, channelName, uniqueNamePrefix, customWelcomeMessage, defaultChips };