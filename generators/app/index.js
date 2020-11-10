/* eslint-disable prettier/prettier */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(`\nWelcome to the ${chalk.blue("Versa chat bot")} generator! \n`);

    this.answers = await this.prompt([
      {
        type: "input",
        name: "chatbotName",
        message: "What would you like to call your chat bot?",
        default: this.appname
      },
      {
        type: "input",
        name: "chatbotDescription",
        message: "Enter a description of your chatbot",
        default: this.appname
      },
      {
        type: "input",
        name: "authorName",
        message: "Who is the author of this chatbot?",
        default: "N/A"
      },
      {
        type: "input",
        name: "companyName",
        message: "What is the company name (leave blank if none)?",
        default: "N/A"
      },
      {
        type: "confirm",
        name: "twilioFlex",
        message:
          "Would you like to enable Twilio Flex for Live Agent Handover (it is easy to integrate later if you say no)?"
      },
      {
        type: "list",
        name: "deployment",
        message: "Where would you like to deploy your chatbot?",
        choices: ["Google Cloud Platform", "AWS"]
      }
    ]);
  }

  writing() {
    const {
      chatbotName,
      chatbotDescription,
      authorName,
      companyName,
      twilioFlex,
      deployment
    } = this.answers;

    const chatbotNameNoSpaces = chatbotName.replace(/ /g, "-");

    this.fs.copyTpl(
      this.templatePath(`frontend`),
      this.destinationPath(`frontend`),
      {
        chatbotName: chatbotNameNoSpaces,
        chatbotDescription,
        authorName,
        companyName
      }
    );

    this.fs.copyTpl(
      this.templatePath("backend"),
      this.destinationPath(`backend`),
      {
        chatbotName: chatbotNameNoSpaces,
        chatbotDescription,
        authorName,
        companyName
      }
    );

    this.fs.copy(
      this.templatePath(`pipelines/this.copy.gitignore`),
      this.destinationPath(`.gitignore`)
    );

    
    if (deployment === "Google Cloud Platform")  {

      if (twilioFlex === true) {

        this.fs.copyTpl(
          this.templatePath("readme-files/README-google-twilio.md"),
          this.destinationPath(`README.md`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copy(
          this.templatePath(`readme-images`),
          this.destinationPath(`readme-images`)
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/google-app-engine-twilio/bitbucket-pipelines.yml"),
          this.destinationPath(`bitbucket-pipelines.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/google-app-engine-twilio/app.yaml"),
          this.destinationPath(`backend/app.yaml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
  
        this.fs.copy(
          this.templatePath(`pipelines/this.copy.twilio.env`),
          this.destinationPath(`backend/.env`)
        );

        this.fs.copyTpl(
          this.templatePath("set-up/google-twilio.md"),
          this.destinationPath(
            `set-up-${chatbotNameNoSpaces}-step-by-step-guide.md`
          ),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
        
        this.fs.copy(
          this.templatePath(`set-up/set-up-imgs`),
          this.destinationPath(`set-up-imgs`)
        );

        this.fs.copy(
          this.templatePath(`TwilioEnableCustomChatPlugin.js`),
          this.destinationPath(`TwilioEnableCustomChatPlugin.js`)
        );

      } else {

        this.fs.copyTpl(
          this.templatePath("readme-files/README-google.md"),
          this.destinationPath(`README.md`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copy(
          this.templatePath(`readme-images`),
          this.destinationPath(`readme-images`)
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/google-app-engine/bitbucket-pipelines.yml"),
          this.destinationPath(`bitbucket-pipelines.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/google-app-engine/app.yaml"),
          this.destinationPath(`backend/app.yaml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
  
        this.fs.copy(
          this.templatePath(`pipelines/this.copy.env`),
          this.destinationPath(`backend/.env`)
        );

        this.fs.copyTpl(
          this.templatePath("set-up/google.md"),
          this.destinationPath(
            `set-up-${chatbotNameNoSpaces}-step-by-step-guide.md`
          ),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
        
        this.fs.copy(
          this.templatePath(`set-up/set-up-imgs`),
          this.destinationPath(`set-up-imgs`)
        );
      }
    } else if (deployment === "AWS") {

      if (twilioFlex === true) {

        this.fs.copyTpl(
          this.templatePath("readme-files/README-aws-twilio.md"),
          this.destinationPath(`README.md`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/aws-twilio/bitbucket-pipelines.yml"),
          this.destinationPath(`bitbucket-pipelines.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/aws-twilio/backend-serverless.yml"),
          this.destinationPath(`backend/serverless.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copyTpl(
          this.templatePath("pipelines/aws-twilio/frontend-serverless.yml"),
          this.destinationPath(`frontend/serverless.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copyTpl(
          this.templatePath("pipelines/aws-twilio/package.frontend.json"),
          this.destinationPath(`frontend/package.json`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copy(
          this.templatePath(`pipelines/aws-twilio/keys.js`),
          this.destinationPath(`backend/config/keys.js`)
        );

        this.fs.copy(
          this.templatePath(`pipelines/this.copy.twilio.env`),
          this.destinationPath(`backend/.env`)
        );

        this.fs.copyTpl(
          this.templatePath("set-up/aws-twilio.md"),
          this.destinationPath(
            `set-up-${chatbotNameNoSpaces}-step-by-step-guide.md`
          ),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
        
        this.fs.copy(
          this.templatePath(`set-up/set-up-imgs`),
          this.destinationPath(`set-up-imgs`)
        );

        this.fs.copy(
          this.templatePath(`TwilioEnableCustomChatPlugin.js`),
          this.destinationPath(`TwilioEnableCustomChatPlugin.js`)
        );

      } else {

        this.fs.copyTpl(
          this.templatePath("readme-files/README-aws.md"),
          this.destinationPath(`README.md`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/aws/bitbucket-pipelines.yml"),
          this.destinationPath(`bitbucket-pipelines.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
    
        this.fs.copyTpl(
          this.templatePath("pipelines/aws/backend-serverless.yml"),
          this.destinationPath(`backend/serverless.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copyTpl(
          this.templatePath("pipelines/aws/frontend-serverless.yml"),
          this.destinationPath(`frontend/serverless.yml`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copyTpl(
          this.templatePath("pipelines/aws/package.frontend.json"),
          this.destinationPath(`frontend/package.json`),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );

        this.fs.copy(
          this.templatePath(`pipelines/aws/keys.js`),
          this.destinationPath(`backend/config/keys.js`)
        );

        this.fs.copy(
          this.templatePath(`pipelines/this.copy.env`),
          this.destinationPath(`backend/.env`)
        )

        this.fs.copyTpl(
          this.templatePath("set-up/aws.md"),
          this.destinationPath(
            `set-up-${chatbotNameNoSpaces}-step-by-step-guide.md`
          ),
          {
            chatbotName: chatbotNameNoSpaces,
            chatbotDescription,
            authorName,
            companyName
          }
        );
        
        this.fs.copy(
          this.templatePath(`set-up/set-up-imgs`),
          this.destinationPath(`set-up-imgs`)
        );
      }
    }
  }


  end() {
    const { chatbotName } = this.answers;
    const chatbotNameNoSpaces = chatbotName.replace(/ /g, "-");
    this.log(
        `\n\nYour chatbot is called ${chalk.green(chatbotNameNoSpaces)} \nYour ${chalk.green("Frontend")} and ${chalk.green("Backend")} Folders have been created.\nTo install dependencies cd into the folders and run ${chalk.green("npm install")} or ${chalk.green("yarn install")}. \nFollow the instructions in the ${chalk.green(`set-up-${chatbotNameNoSpaces}-step-by-step-guide`)} Markdown file in the root folder.\n`
    );
  }
};
