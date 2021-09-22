export interface IBotState {
  messages: IBotStateMessages[];
  showBot: boolean;
  showDots: boolean;
  showMenu: boolean;
  notification: string | null;
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
