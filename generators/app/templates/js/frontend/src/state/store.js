import { createStore, combineReducers } from 'redux';
import botReducer from './bot/bot.state';

const rootReducer = combineReducers({
  bot: botReducer
})

const mainStore = createStore(rootReducer);

export default mainStore;