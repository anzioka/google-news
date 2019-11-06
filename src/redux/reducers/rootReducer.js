import { combineReducers } from 'redux';
import * as types from '../constants';
import { categories } from '../actions/actions';

const visible = window.innerWidth <= types.BREAK_POINT ? false: true;
function sideNavVisible(state = visible, action) {
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
function articles(state = {isFetching: true, items : [], pageNum: 1, maxPages: 1, dateReceived: null}, action) {
  switch (action.type) {
    case types.REQUEST_ARTICLES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        items: action.pageNum === 1 ? action.data : state.items.concat(action.data),
        isFetching: false,
        dateReceived: action.dateReceived,
        pageNum: action.pageNum,
        maxPages: action.maxPages
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

function newsSources(state = [], action) {
  switch (action.type) {
    case types.RECEIVE_SOURCES:
      return action.sources;
    default:
      return state
  }
}

function screenWidth(state = window.innerWidth, action) {
  switch (action.type) {
    case types.RESIZE_SCREEN:
      return action.width
    default:
      return state
  }
}
const queryState = {query: "", isFetching: false, items: [], dateReceived: null, pageNum: 1, maxPages: 1};
function query(state = queryState, action) {
  switch (action.type) {
    case types.INITIATE_SEARCH:
      return Object.assign({}, state, {
        isFetching: true,
        query: action.query
      })
    case types.RECEIVE_SEARCH_RESULTS:
      return Object.assign({}, state, {
        items: action.pageNum === 1 ? action.items : state.items.concat(action.items),
        dateReceived: action.dateReceived,
        pageNum: action.pageNum,
        maxPages: action.maxPages,
        query: action.query,
        isFetching: false
      });
    default:
      return state;
  }
}

function displayType(state = types.HEADLINES_DISPLAY, action) {
  switch (action.type) {
    case types.DISPLAY_TYPE:
      return action.display;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case types.ON_ERROR:
      return action.message;
    default:
      return state;
  }
}

//// TODO: search results (group by the search query)
//possibly store page number?

const rootReducer = combineReducers({
  sideNavVisible,
  selectedCategory,
  articlesByCategory,
  newsSources,
  screenWidth,
  displayType,
  query,
  error
});

export default rootReducer;
