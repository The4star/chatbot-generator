'use strict';
const DialogflowFormatter = require('../../../botExport/DialogflowFormatter');
const dialogflowExport = require('../../../botExport/DialogflowExport');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const preExportCheck = () => {
  const serviceAccount = DialogflowFormatter.botSettings.DialogflowServiceAccount
  if (!serviceAccount) {
    throw new Error("No Dialogflow Service Account Detected.")
  } else {
    if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
      throw new Error("Service Account not formatted properly.")
    }
  }
}
module.exports = {
  async dfsync(context) {
    try {
      // get the data
      const intents = await strapi.services.intent.find();
      const entities = await strapi.services.entity.find();
      DialogflowFormatter.botSettings = await strapi.services.settings.find();
      DialogflowFormatter.unformattedData = { intents, entities };

      // get the host configuration for image urls
      DialogflowFormatter.host = context.request.header.host;
      DialogflowFormatter.schema = context.request.header.referer.includes('https') ? 'https://' : 'http://'

      //check all is formatted correctly.
      await preExportCheck()

      //build and export.
      await DialogflowFormatter.build();
      await dialogflowExport();
      return {
        message: "Agent successfully exported to Dialogflow"
      }
    } catch (error) {
      console.log(error);
      return {
        error: error.message
      }
    }
  }
};
