import React, { useReducer, createContext } from 'react';

// reducer
import { botReducer, botInitialState } from './BotStateReducer';

const BotContext = createContext();

const BotStateProvider = ({ children }) => {
  const reducer = useReducer(botReducer, botInitialState);
  return (
    <BotContext.Provider value={reducer}>
      {children}
    </BotContext.Provider>
  )
}

export {
  BotContext,
  BotStateProvider
}