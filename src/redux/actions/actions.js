import fetch from 'cross-fetch';
import AppConfig from '../../config/AppConfig';
import { HEADLINES_URL, EVERYTHING_URL, SEARCH_RESULTS_AGE, ERROR_MESSAGE } from '../../utils/constants';
import * as types from '../constants';
import { getMaxPages, diffMinutes } from '../../utils/Utils';

export function setDisplayType(display) {
  return {
    type: types.DISPLAY_TYPE,
    display: display
  }
}

export function setError(message) {
  return {
    type: types.ON_ERROR,
    message
  }
}

export function toggleSideNav() {
  return {
    type: types.TOGGLE_SIDENAV
  };
};

export function setScreenWidth() {
  return {
    type: types.RESIZE_SCREEN,
    width: window.innerWidth
  }
}


export function selectCategory(category) {
  return {
    type: types.SELECT_CATEGORY,
    category
  };
};

function requestArticles(category) {
  return {
    type: types.REQUEST_ARTICLES,
    category
  }
}

function receiveArticles(category,json, pageNum) {
  return {
    type: types.RECEIVE_ARTICLES,
    category,
    pageNum,
    maxPages: getMaxPages(json.totalResults),
    dateReceived: Date.now(),
    data: json.articles,
  }
}


//fetch news headlines
function fetchHeadlines(category, pageNum, searchType) {
  return (dispatch, getState) => {
    if (searchType === types.INITIAL_SEARCH) {
      dispatch(requestArticles(category));
    }
    return fetch(`${HEADLINES_URL}category=${category}&page=${pageNum}&apiKey=${AppConfig.NEWS_API}&country=us`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else{
          dispatch(setError(ERROR_MESSAGE));
          return Promise.resolve();
        }
      })
      .then((json) => {
        dispatch(receiveArticles(category, json, pageNum));
        dispatch(setError(null));
      })
    }
}

//gets called at the start of a network request for articles matching keyword => display spinner
function initiateSearch(query) {
  return {
    type: types.INITIATE_SEARCH,
    query
  }
}

//searchType: INITIAL_SEARCH or EXTRA_SEARCH
export function fetchHeadlinesIfNeeded(category, searchType) {
  return (dispatch, getState) => {
    const articles = getState().articlesByCategory[category];
    if (articles && articles.isFetching) {
      return Promise.resolve();
    }
    const pageNum = articles && searchType === types.EXTRA_SEARCH ? articles.pageNum + 1 : 1;

    if (articles) {
      //are we looking for extra results
      if (searchType === types.INITIAL_SEARCH) {
        const diff = diffMinutes(articles.dateReceived, Date.now());
        if (diff >= SEARCH_RESULTS_AGE) {
          return dispatch(fetchHeadlines(category, pageNum, searchType));
        } else{
          return Promise.resolve();
        }
      } else {
        //fetch extra results
        if (articles.pageNum < articles.maxPages) {
          return dispatch(fetchHeadlines(category, pageNum, searchType));
        } else {
          return Promise.resolve();
        }
      }
    } else {
      return dispatch(fetchHeadlines(category, pageNum, searchType));
    }
  }
}


function receiveSearchResults(query, json, pageNum) {
  return {
    type: types.RECEIVE_SEARCH_RESULTS,
    query,
    items: json.articles,
    dateReceived: Date.now(),
    maxPages: getMaxPages(json.totalResults),
    pageNum
  }
}

export function searchArticles(query, pageNum, searchType) {
  console.log("starting search");
  return dispatch => {
    if (searchType === types.INITIAL_SEARCH) {
      dispatch(initiateSearch(query));
    }
    return fetch(`${EVERYTHING_URL}q=${query}&language=en&page=${pageNum}&sortBy=publishedAt&apiKey=${AppConfig.NEWS_API}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else{
          dispatch(setError(ERROR_MESSAGE));
          return Promise.resolve();
        }
      })
      .then((json) => {
        dispatch(receiveSearchResults(query, json, pageNum));
        dispatch(setError(null));
      })
    }
}


export function searchArticlesIfNeeded(query, searchType) {
  return (dispatch, getState ) => {
    if (query === "") {
      return dispatch(setError("Sorry, please enter your query in the search bar and hit enter"));
    }

    const current = getState().query;
    if (current.isFetching) {
      return Promise.resolve();
    }

    //what page number do we want? if user hit pressed search button we want to retrieve the first page
    const pageNum = searchType === types.INITIAL_SEARCH ? 1 : current.pageNum + 1;
    if (current.query === query) {
        if (searchType === types.INITIAL_SEARCH) {
          const diff = diffMinutes(current.dateReceived, Date.now());
          if (diff >= SEARCH_RESULTS_AGE) {
            return dispatch(searchArticles(query, pageNum, searchType));
          } else{
            return Promise.resolve();
          }
        } else{
          if (current.pageNum < current.maxPages) {
            return dispatch(searchArticles(query, pageNum, searchType));
          } else {
            return Promise.resolve();
          }
        }
    } else {
      //different query
      return dispatch(searchArticles(query, pageNum, searchType));
    }
  }
}
