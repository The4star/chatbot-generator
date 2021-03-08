# Strapi To Dialogflow for <%=chatbotName%>

An interaction model between Strapi CMS and dialogflow using postgres as the database. This is setup to work with Dialogflow messenger and Versa's Chatbot Generator. To work with another platform or add custom functionality, the models will need to be changed and the bot export code modified. 

## Getting started

* Install Dependencies

```bash
yarn
```

* Connect to database.
  
If you need to make changes to the interaction model It is best to connect to a local postgres database while making any changes. Once changes are finished you can deploy and connect to your deployed postgres database/database service. Database settings are configured in `config/database.js`

* Make changes to interaction model

To change collections/models in strapi run `yarn develop` 

If any changes are made you will need to make changes to the code that exports to dialogflow in order for the new logic to be synced. To do so and have the code recompile as you work run the following command:

```bash
yarn adminDev
```

With this command run strapi will watch the `admin` folder and recompile as you work. You can customise the home page contained in here. 

The flow for how the bot export code works can be found in `api/intent/controllers/intent.js` The function that runs the logic is called `dfsync()`.

The rest of the logic lives in the `botExport` folder. 

** Deployment and docs

[Click here](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html) For the strapi documentation including how to deploy to many platforms. 