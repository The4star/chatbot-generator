const botReducer = (state, action) => {
  switch (action.type) {
    case "updateMessages": {
      return {
        ...state,
        messages: [...state.messages, ...action.messages],
      };
    }
    case "showDots": {
      return { ...state, showDots: action.showDots };
    }
    case "toggleBot": {
      return { ...state, showBot: !state.showBot };
    }
    case "toggleMenu": {
      return { ...state, showMenu: !state.showMenu };
    }
    case "toggleWelcomeMessage": {
      return { ...state, showWelcomeMessage: !state.showWelcomeMessage };
    }
    case "setHumanHandover": {
      return { ...state, humanHandover: action.humanHandover };
    }
    case "setShowRestartMessage": {
      return { ...state, showRestartMessage: action.showRestartMessage };
    }
    case "setDisableInput": {
      return { ...state, disableInput: action.disableInput };
    }
    case "setFirstInteraction": {
      return { ...state, firstInteraction: action.firstInteraction };
    }
    default: {
      throw new Error("No action type set for reducer")
    }
  }
};

const botInitialState = {
  messages: [],
  showBot: false,
  showDots: false,
  showMenu: false,
  showWelcomeMessage: false,
  humanHandover: false,
  showRestartMessage: false,
  disableInput: false,
  firstInteraction: true,
}

export {
  botReducer,
  botInitialState
}