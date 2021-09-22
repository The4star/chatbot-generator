import { createStore, combineReducers } from 'redux';
import { IBotState } from '../types/state.types';
import botReducer from './bot/bot.state';

export interface ICombinedStates {
  bot: IBotState
}

const rootReducer = combineReducers({
  bot: botReducer
})

const mainStore = createStore(rootReducer);

export default mainStore;