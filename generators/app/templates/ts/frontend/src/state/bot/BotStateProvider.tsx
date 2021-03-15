import React, { useReducer, createContext, Dispatch } from 'react';
import { IBotAction, IBotState } from '../../types/state.types';

// reducer
import { botReducer, botInitialState } from './BotStateReducer';

const BotContext = createContext<[IBotState, Dispatch<IBotAction>]>([botInitialState, () => null]);

interface IBotStateProviderProps {
  children: any;
}
const BotStateProvider = ({ children }: IBotStateProviderProps) => {
  const reducer = useReducer<React.Reducer<IBotState, IBotAction>, IBotState>(botReducer, botInitialState, (botInitialState) => botInitialState);
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

