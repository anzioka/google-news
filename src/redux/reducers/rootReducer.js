import { combineReducers } from 'redux';
import * as types from '../constants';
import { categories, selectCategory} from '../actions/actions';

function sideNavVisible(state = true, action) {
  switch (action.type) {
    case types.TOGGLE_SIDENAV:
      return !state;
    default:
      return state;
  }
}

//default category: general
function selectedCategory(state = categories[0].value, action) {
  switch(action.type) {
    case types.SELECT_CATEGORY:
      return action.category;
    default:
      return state;
  }
}
function articles(state = {isFetching: true, items : []}, action) {
  switch (action.type) {
    case types.REQUEST_ARTICLES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        items: action.data,
        isFetching: false
      });
    default:
      return state
  }
}
function articlesByCategory(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_ARTICLES:
    case types.RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        [action.category]: articles(state[action.category], action)
      });
    default:
      return state;
  }
}
function language (state = 'en', action) {
  switch (action.type) {
    case types.SELECT_LANGUAGE:
      return action.language;
    default:
      return state;
  }
}

function newsSources(state = [], action) {
  switch (action.type) {
    case types.RECEIVE_SOURCES:
      return action.sources;
    default:
      return state
  }
}


const rootReducer = combineReducers({
  sideNavVisible,
  selectedCategory,
  articlesByCategory,
  language,
  newsSources
});

export default rootReducer;