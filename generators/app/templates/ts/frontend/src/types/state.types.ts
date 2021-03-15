export interface IBotState {
  messages: IBotStateMessages[];
  showBot: boolean;
  showDots: boolean;
  showMenu: boolean;
  showWelcomeMessage: boolean;
  humanHandover: boolean;
  showRestartMessage: boolean;
  disableInput: boolean;
  firstInteraction: boolean
}

export interface IBotStateMessages {
  speaker?: string;
  msg?: string;
  info?: string;
  chips?: IDialogflowQueryResponseChip[];
  cards?: IDialogflowQueryResponseCard[];
  restart?: boolean;
  error?: boolean;
  script?: string;
}

export interface IDialogflowQueryResponseChip {
  value: string;
  link: string;
}

export interface IDialogflowQueryResponseCard {
  title: string;
  subtitle: string;
  link: string;
  image: string;
}

interface IMessageAction {
  type: "updateMessages";
  messages: IBotStateMessages[];
}

interface IShowBotAction {
  type: "toggleBot";
}

interface IShowDotsAction {
  type: "showDots";
  showDots: boolean
}

interface IShowMenuAction {
  type: "toggleMenu";
}

interface IShowWelcomeMessageAction {
  type: "toggleWelcomeMessage";
}

interface IHumanHandoverAction {
  type: "setHumanHandover";
  humanHandover: boolean;
}

interface IShowRestartMessageAction {
  type: "setShowRestartMessage";
  showRestartMessage: boolean;
}

interface IDisableInputAction {
  type: "setDisableInput";
  disableInput: boolean;
}

interface IFirstInteractionAction {
  type: "setFirstInteraction";
  firstInteraction: boolean;
}

export type IBotAction =
  | IMessageAction
  | IShowBotAction
  | IShowDotsAction
  | IShowMenuAction
  | IShowWelcomeMessageAction
  | IHumanHandoverAction
  | IShowRestartMessageAction
  | IDisableInputAction
  | IFirstInteractionAction