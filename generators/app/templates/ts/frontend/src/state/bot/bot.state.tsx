import { AnyAction } from "redux";
import { IBotState, IBotStateMessages } from "../../types/state.types"

const botInitialState: IBotState = {
  messages: [],
  showBot: false,
  showDots: false,
  showMenu: false,
  notification: "",
  humanHandover: false,
  showRestartMessage: false,
  disableInput: false,
  firstInteraction: true,
}

enum BotActions {
  UPDATE_MESSAGES = 'UPDATE_MESSAGES',
  SET_SHOW_DOTS = "SHOW_DOTS",
  TOGGLE_BOT = "TOGGLE_BOT",
  TOGGLE_MENU = "TOGGLE_MENU",
  SET_NOTIFICATION = "SET_NOTIFICATION",
  SET_HUMAN_HANDOVER = "SET_HUMAN_HANDOVER",
  SET_SHOW_RESTART_MESSAGE = "SET_SHOW_RESTART_MESSAGE",
  SET_DISABLE_INPUT = "SET_DISABLE_INPUT",
  SET_FIRST_INTERACTION = "SET_FIRST_INTERACTION",
}

// ACTIONS
export const updateMessages = (messages: IBotStateMessages[]): AnyAction => ({ type: BotActions.UPDATE_MESSAGES, data: messages });
export const setShowDots = (value: boolean): AnyAction => ({ type: BotActions.SET_SHOW_DOTS, data: value });
export const toggleBot = (): AnyAction => ({ type: BotActions.TOGGLE_BOT });
export const toggleMenu = (): AnyAction => ({ type: BotActions.TOGGLE_MENU });
export const setNotification = (notification: string | null): AnyAction => ({ type: BotActions.SET_NOTIFICATION, data: notification });
export const setHumanHandover = (value: boolean): AnyAction => ({ type: BotActions.SET_HUMAN_HANDOVER, data: value });
export const setShowRestartMessage = (value: boolean): AnyAction => ({ type: BotActions.SET_SHOW_RESTART_MESSAGE, data: value });
export const setDisableInput = (value: boolean): AnyAction => ({ type: BotActions.SET_DISABLE_INPUT, data: value });
export const setFirstInteraction = (value: boolean): AnyAction => ({ type: BotActions.SET_FIRST_INTERACTION, data: value });

const botReducer = (state = botInitialState, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case BotActions.UPDATE_MESSAGES: {
      return {
        ...state,
        messages: [...state.messages, ...data],
      };
    }
    case BotActions.SET_SHOW_DOTS: {
      return { ...state, showDots: data };
    }
    case BotActions.TOGGLE_BOT: {
      return { ...state, showBot: !state.showBot };
    }
    case BotActions.TOGGLE_MENU: {
      return { ...state, showMenu: !state.showMenu };
    }
    case BotActions.SET_NOTIFICATION: {
      return { ...state, notification: data };
    }
    case BotActions.SET_HUMAN_HANDOVER: {
      return { ...state, humanHandover: data };
    }
    case BotActions.SET_SHOW_RESTART_MESSAGE: {
      return { ...state, showRestartMessage: data };
    }
    case BotActions.SET_DISABLE_INPUT: {
      return { ...state, disableInput: data };
    }
    case BotActions.SET_FIRST_INTERACTION: {
      return { ...state, firstInteraction: data };
    }
    default: {
      return state
    }
  }
};

export default botReducer;