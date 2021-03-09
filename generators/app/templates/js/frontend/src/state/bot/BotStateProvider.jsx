import React, { useEffect, useReducer, createContext } from 'react';

// reducer
import { botReducer, botInitialState } from './BotStateReducer';

const BotStateContext = createContext();
const BotDispatchContext = createContext();

const BotStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(botReducer, botInitialState);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    if (!state.showBot) {
      if (window.dataLayer.length) {
        window.dataLayer.push({ 'event': 'bot_closed' });
      }
    } else {
      window.dataLayer.push({ 'event': 'bot_open' });
    }
  }, [state.showBot])

  return (
    <BotDispatchContext.Provider value={dispatch}>
      <BotStateContext.Provider value={state}>
        {children}
      </BotStateContext.Provider>
    </BotDispatchContext.Provider>
  )
}

export {
  BotStateContext,
  BotDispatchContext,
  BotStateProvider
}