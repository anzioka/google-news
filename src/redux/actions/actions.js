import fetch from 'cross-fetch';
import AppConfig from '../../config/AppConfig';
import {
  MdFlag,
  MdBusiness,
  MdHealing,
  MdLocalMovies,
} from 'react-icons/md';

import { FaRunning, FaMemory, FaFlask } from 'react-icons/fa';


import * as types from '../constants';

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

//toggle side navigation
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


export const categories = [
  {icon: MdFlag, label: "General", value: 'general'},
  {icon: MdBusiness, label: "Business", value: 'business'},
  {icon: MdLocalMovies, label: "Entertainment", value: "entertainment"},
  {icon: FaFlask, label: "Science", value: "science"},
  {icon: FaRunning, label: "Sports", value: 'sports'},
  {icon: MdHealing, label: "Health", value: 'health'},
  {icon: FaMemory, label: "Technology", value: 'technology'},
];

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


//async function: fetch headlines
//need to modify this to fetch more: set page=?
function fetchHeadlines(category, pageNum, searchType) {
  return (dispatch, getState) => {
    if (searchType === types.INITIAL_SEARCH) {
      dispatch(requestArticles(category));
    }
    return fetch(`${types.HEADLINES_URL}category=${category}&page=${pageNum}&apiKey=${AppConfig.NEWS_API}&country=us`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else{
          dispatch(setError(types.ERROR_MESSAGE));
          return Promise.resolve();
        }
      })
      .then((json) => {
        dispatch(receiveArticles(category, json, pageNum));
        dispatch(setError(null));
      })
    }
}

//
export function fetchHeadlinesIfNeeded(category, searchType) {
  //want to fetch only if not fetching, or if there are more items to fetch
  return (dispatch, getState) => {
    const articles = getState().articlesByCategory[category];
    if (articles && articles.isFetching) {
      return Promise.resolve();
    }
    const pageNum = articles && searchType === types.EXTRA_SEARCH ? articles.pageNum + 1 : 1;

    if (articles) {
      //are we looking for extra results or what
      if (searchType === types.INITIAL_SEARCH) {
        const diff = diffMinutes(articles.dateReceived, Date.now());
        if (diff >= QUERY_REFRESH_TIMER) {
          return dispatch(fetchHeadlines(category, pageNum, searchType));
        } else{
          console.log("Previous results still in cache");
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

function initiateSearch(query) {
  return {
    type: types.INITIATE_SEARCH,
    query
  }
}

const MAX_RESULTS = 100;
const RESULTS_PER_PAGE = 20;
function getMaxPages(totalResults) {
  const maxResults = Math.min(MAX_RESULTS, totalResults);
  return Math.ceil(maxResults/RESULTS_PER_PAGE);
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
    return fetch(`${types.EVERYTHING_URL}q=${query}&language=en&page=${pageNum}&sortBy=publishedAt&apiKey=${AppConfig.NEWS_API}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else{
          dispatch(setError(types.ERROR_MESSAGE));
          return Promise.resolve();
        }
      })
      .then((json) => {
        dispatch(receiveSearchResults(query, json, pageNum));
        dispatch(setError(null));
      })
    }

}

function diffMinutes(date1, date2) {
  var diff = (date2 - date1) / 1000;
  diff /= 60;
  return Math.abs(Math.ceil(diff));
}

const QUERY_REFRESH_TIMER = 5;
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
          if (diff >= QUERY_REFRESH_TIMER) {
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
