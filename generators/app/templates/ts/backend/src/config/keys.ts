const deployed = !!process.env.LAMBDA_TASK_ROOT && process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production";

const keys = {
    googleProjectID: process.env.GOOGLE_PROJECT_ID,
    dialogFlowSessionID: process.env.DIALOGFLOW_SESSION_ID,
    dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE,
    googleClientEmail: deployed ? JSON.parse(process.env.GOOGLE_CLIENT_EMAIL!) : process.env.GOOGLE_CLIENT_EMAIL,
    googlePrivateKey: deployed ? JSON.parse(process.env.GOOGLE_PRIVATE_KEY!) : process.env.GOOGLE_PRIVATE_KEY
}
export default keys