/* eslint-disable prettier/prettier */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

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
    
    if (twilioFlex === true && deployment === "Google Cloud Platform")  {

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

      this.fs.copyTpl(
        this.templatePath("set-up-your-chatbot-step-by-step-guide.md"),
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
        this.templatePath(`set-up-imgs`),
        this.destinationPath(`set-up-imgs`)
      );
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
