const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');
const fs = require('fs');
var zipper = require("zip-local");
const DialogflowFormatter = require('./DialogflowFormatter');

const dialogflowExport = async () => {
  const { private_key, client_email, project_id } = DialogflowFormatter.botSettings.DialogflowServiceAccount
  const credentials = {
    client_email,
    private_key
  };
  const agentClient = new dialogflow.AgentsClient({ projectId: project_id, credentials })
  const outputDir = path.join(__dirname, "../tmp")
  const filepath = `${outputDir}/agent.zip`
  await zipper.sync
    .zip(`${outputDir}/output`)
    .compress()
    .save(filepath);
  const agentContent = await fs.readFileSync(filepath, { encoding: 'base64' });
  await agentClient.restoreAgent({
    parent: `projects/${project_id}`,
    agentContent
  })
}

module.exports = dialogflowExport;