import { combineReducers } from 'redux';

import {
  SUCCESS_FETCH_SERVER_STATE, CLICK_ROLLOUT, CLICK_SALIENCY,
} from '../actions';

const distinctColors = require('distinct-colors');

const actionMeanings = (state = {}, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      if (Object.keys(action.actionMeanings).length === Object.keys(state).length) {
        return state;
      }

      return action.actionMeanings;
    default:
      return state;
  }
};

const actionColors = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE: {
      if (Object.keys(action.actionMeanings).length === state.length) {
        return state;
      }

      return distinctColors({ count: Object.values(action.actionMeanings).length, lightMin: 30 }).map((color) => (color.css()));
    }
    default:
      return state;
  }
};

const isJobRunning = (state = true, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      return action.isJobRunning;
    case CLICK_ROLLOUT:
      return true;
    case CLICK_SALIENCY:
      return true;
    default:
      return state;
  }
};

const isRolloutOnMemory = (state = false, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      return action.isRolloutOnMemory;
    default:
      return state;
  }
};

const serverState = combineReducers({
  actionMeanings,
  actionColors,
  isJobRunning,
  isRolloutOnMemory,
});

export default serverState;
