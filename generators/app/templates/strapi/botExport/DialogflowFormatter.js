const { v4: uuidv4 } = require('uuid');
const { removeWhiteSpace } = require('./helpers/general.helpers');
const fs = require("fs");
const path = require("path");
class DialogflowFormatter {
  constructor() {
    this.unformattedData = {}
    this.formattedIntents = []
    this.formattedEntities = []
    this.botSettings = {}
  }

  createIntent = (intent) => {
    const data = {
      id: uuidv4(),
      name: removeWhiteSpace(intent.IntentName),
      auto: true,
      contexts: [],
      responses: [
        {
          resetContexts: false,
          action: removeWhiteSpace(intent.IntentName),
          affectedContexts: [],
          parameters: intent.entities.length ? this.createEntities(intent.entities) : [],
          messages: [
            {
              type: "0",
              title: "",
              textToSpeech: "",
              lang: "en",
              condition: "",
              speech: this.formatResponses(intent.Responses)
            },
            (intent.SuggestionChips.length ? this.suggestionChipPayload(intent.SuggestionChips) : {})
          ],
          speech: []
        }
      ],
      priority: this.setIntentPriority(intent.Priority),
      webhookUsed: false,
      webhookForSlotFilling: false,
      fallbackIntent: intent.IntentName === "DefaultFallbackIntent" ? true : false,
      events: intent.EventName ? [{ name: intent.EventName }] : [],
      conditionalResponses: [],
      condition: "",
      conditionalFollowupEvents: []
    };
    return data;
  };

  setIntentPriority = (priority) => {
    switch (priority) {
      case "High":
        return 1000000
      case "Default":
        return 500000
      case "Ignore":
        return -1
      default:
        return 500000;
    }
  }

  formatResponses = (responses) => {
    return responses.map(response => (
      response.Text
    ))
  }

  createEntities = (entities) => {
    return entities.map(entity => {
      const data = {
        id: uuidv4(),
        name: entity.EntityName,
        required: false,
        dataType: `@${entity.EntityName}`,
        value: `$${entity.EntityName}`,
        defaultValue: "",
        isList: true,
        prompts: [],
        promptMessages: [],
        noMatchPromptMessages: [],
        noInputPromptMessages: [],
        outputDialogContexts: []
      };
      return data;
    });
  };

  suggestionChipPayload = (suggestionChips) => {
    return {
      "type": "4",
      "title": "",
      "payload": {
        "richContent": [
          [
            {
              "type": "chips",
              "options": suggestionChips.map(suggestionChip => {
                if (suggestionChip.Link) {
                  return {
                    text: suggestionChip.Text,
                    link: suggestionChip.Link
                  }
                } else {
                  return {
                    text: suggestionChip.Text,
                    link: suggestionChip.Link
                  }
                }

              })
            }
          ]
        ]
      },
      "textToSpeech": "",
      "lang": "en",
      "condition": ""
    }
  }

  createUtterances = (unformattedUtterances) => {

    const utteranceIntentTemplate = entity => {
      const value = entity.substring(1, entity.length - 1).split("|");
      return {
        text: value[1],
        meta: `@${value[0]}`,
        alias: value[0],
        userDefined: true
      };
    };

    const utteranceTemplate = utteranceArr => {
      return {
        id: uuidv4(),
        data: utteranceArr.map(utteranceComponent => {
          if (utteranceComponent.includes("{")) {
            return utteranceIntentTemplate(utteranceComponent);
          }
          return {
            text: utteranceComponent,
            userDefined: false
          };
        }),
        isTemplate: false,
        count: 0,
        lang: "en",
        updated: 0
      };
    };
    const utterances = unformattedUtterances.split("\n");
    return utterances.map(utterance =>
      utteranceTemplate(utterance.split(/({.+})/g).filter(f => f.length > 0))
    );
  };

  createEntity = () => {
    const data = this.unformattedData.entities.map(entity => {
      const allEntries = entity.EntityValue.map(m => {
        const synonyms = [...m.Synonyms.split("\n"), m.Key];
        return {
          value: m.Key,
          synonyms: synonyms.filter(e => e !== undefined && e !== '').map(e => { return e.trim(); })
        }
      });
      return {
        name: entity.EntityName,
        entries: [...allEntries],
        entity: {
          id: uuidv4(),
          name: entity.EntityName,
          isOverridable: true,
          isEnum: false,
          isRegexp: false,
          automatedExpansion: false,
          allowFuzzyExtraction: false
        }
      };
    });
    return data
  };

  formatIntents = () => {
    return this.unformattedData.intents.map(intent => ({
      intentName: intent.IntentName,
      utterances: intent.Utterances ? this.createUtterances(intent.Utterances) : null,
      intent: this.createIntent(intent)
    }));
  }

  createFallbackIntent = () => {

    if (!this.botSettings.DefaultFallbackIntent || this.botSettings.DefaultFallbackIntent && !this.botSettings.DefaultFallbackIntent.Responses.length) {
      throw new Error("No Default Fallback Intent Responses detected in Settings.")
    }

    const responses = this.botSettings.DefaultFallbackIntent.Responses;
    const fallbackObject = {
      IntentName: "DefaultFallbackIntent",
      Utterances: null,
      Priority: "Default",
      EventName: null,
      SuggestionChips: [],
      entities: [],
      Responses: responses
    }
    this.unformattedData.intents.push(fallbackObject)
  }

  createAgentJSON = () => {
    const defaultAgent = {
      description: this.botSettings.BotDescription,
      language: "en",
      shortDescription: "",
      examples: "",
      linkToDocs: "",
      displayName: this.botSettings.DialogflowProjectName,
      disableInteractionLogs: false,
      disableStackdriverLogs: false,
      defaultTimezone: "Australia/Sydney",
      webhook: {
        url: "",
        username: "",
        headers: {},
        available: false,
        useForDomains: false,
        cloudFunctionsEnabled: false,
        cloudFunctionsInitialized: false
      },
      isPrivate: true,
      mlMinConfidence: this.botSettings.MinConfidence,
      supportedLanguages: [],
      enableOnePlatformApi: true,
      onePlatformApiVersion: "v2",
      secondaryKey: "7ac1b32f946f45c0a7772a2422650d33",
      analyzeQueryTextSentiment: false,
      enabledKnowledgeBaseNames: [],
      knowledgeServiceConfidenceAdjustment: 0.0,
      dialogBuilderMode: false,
      baseActionPackagesUrl: ""
    };
    return defaultAgent;
  };

  writeData = (outputDir) => {
    this.formattedIntents.forEach(formattedIntent => {
      fs.writeFileSync(`${outputDir}/intents/${formattedIntent.intentName}.json`, JSON.stringify(formattedIntent.intent, null, 2));
      if (formattedIntent.utterances) {
        fs.writeFileSync(
          `${outputDir}/intents/${formattedIntent.intentName}_usersays_en.json`,
          JSON.stringify(formattedIntent.utterances, null, 2)
        );
      }
    });
    this.formattedEntities.forEach(formattedEntity => {
      fs.writeFileSync(`${outputDir}/entities/${formattedEntity.name}.json`, JSON.stringify(formattedEntity.entity, null, 2));
      fs.writeFileSync(
        `${outputDir}/entities/${formattedEntity.name}_entries_en.json`,
        JSON.stringify(formattedEntity.entries, null, 2)
      );
    });
    fs.writeFileSync(
      `${outputDir}/agent.json`,
      JSON.stringify(this.createAgentJSON(), null, 2)
    );
    fs.writeFileSync(`${outputDir}/package.json`, JSON.stringify({ version: "1.0.0" }, null, 2));
  }

  build = () => {
    const outputDir = path.join(__dirname, "../tmp")
    removeDir(outputDir);
    this.createFallbackIntent();
    this.formattedIntents = this.formatIntents();
    this.formattedEntities = this.createEntity();
    fs.mkdirSync(outputDir)
    fs.mkdirSync(`${outputDir}/output`)
    fs.mkdirSync(`${outputDir}/output/intents`)
    fs.mkdirSync(`${outputDir}/output/entities`)
    this.writeData(`${outputDir}/output`)
  }
}

module.exports = new DialogflowFormatter();