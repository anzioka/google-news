import fetch from 'cross-fetch';
import AppConfig from '../../config/AppConfig';
import {
  MdFlag,
  MdBusiness,
  MdHealing
} from 'react-icons/md';

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
  {icon: MdFlag, label: "Entertainment", value: "entertainment"},
  {icon: MdFlag, label: "Science", value: "science"},
  {icon: MdFlag, label: "Sports", value: 'sports'},
  {icon: MdHealing, label: "Health", value: 'health'},
  {icon: MdFlag, label: "Technology", value: 'technology'},
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

function receiveArticles(category,articles) {
  return {
    type: types.RECEIVE_ARTICLES,
    category,
    dateReceived: Date.now(),
    data: articles
  }
}


//async function: fetch headlines
//need to modify this to fetch more: set page=?
function fetchArticles(category) {
  return (dispatch, getState) => {
    dispatch(requestArticles(category))
    return fetch(`${types.HEADLINES_URL}category=${category}&apiKey=${AppConfig.NEWS_API}&country=us`)
      .then(response => response.json(), error => console.log("Fetch error:", error))
      .then(json  => dispatch(receiveArticles(category, json.articles)))
    }
}


//todo: make sure to fetch once per day! also pageSize param
//enable search for news
//
function shouldFetchPosts(state, category) {
  const articles = state.articlesByCategory[category];
  if (!articles) {
    return true;
  } else if (articles.isFetching) {
    return false;
  }
}

export function fetchArticlesIfNeeded(category) {
  //want to fetch only if not fetching, or if there are more items to fetch
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), category)) {
      return dispatch(fetchArticles(category));
    } else{
      return Promise.resolve();
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
  //console.log(json);
  return {
    type: types.RECEIVE_SEARCH_RESULTS,
    query,
    items: json.articles,
    dateReceived: Date.now(),
    maxPages: getMaxPages(json.totalResults),
    pageNum
  }
}

//only keep records of current searc
//search for articles
//if (new query == current query)? --
  //is the last search more than 5 minutes ago? refresh results? reset page number, and maximum page number
//else:
  //if there are more pages to go, fetch the next page,

//is this a new query ? proceeed normally?
  //check if there are any more pages remaining? maximum num of pages = 100/20
//if totalResults < 100, then num pages = totalResults / 20
//for current query we need to store current page number and maximum page number

//if query is different: search and replace current results, reset page number counter
//
export function searchArticles(query, pageNum) {
  console.log("starting search");
  return dispatch => {
    dispatch(initiateSearch(query));
    return fetch(`${types.EVERYTHING_URL}q=${query}&language=en&sortBy=publishedAt&apiKey=${AppConfig.NEWS_API}`)
      .then(response => response.json())
      .then((json)  => {
        dispatch(setError(null));
        dispatch(receiveSearchResults(query, json, pageNum));
      })
  }
}

function diffMinutes(date1, date2) {
  var diff = (date2 - date1) / 1000;
  diff /= 60;
  return Math.abs(Math.ceil(diff));
}

//need to disable search if the query is empty
const QUERY_REFRESH_TIMER = 5;
export function searchArticlesIfNeeded(query, searchType) {
  return (dispatch, getState ) => {
    if (query === "") {
      return dispatch(setError("Sorry, please enter your query in the search bar and hit enter"));
    }

    const current = getState().query;
    if (current.isSearching) {
      return Promise.resolve();
    }

    //what page number do we want? if user hit pressed search button we want to retrieve the first page
    const pageNum = searchType === types.INITIAL_SEARCH ? 1 : current.pageNum;
    // console.log(current);
    if (current.query === query) {
        if (searchType === types.INITIAL_SEARCH) {
          const diff = diffMinutes(current.dateReceived, Date.now());
          if (diff >= QUERY_REFRESH_TIMER) {
            return dispatch(searchArticles(query, pageNum));
          } else{
            return Promise.resolve();
          }
        } else{
          if (current.pageNum < current.maxPages) {
            return dispatch(searchArticles(query, pageNum));
          } else {
            return Promise.resolve();
          }
        }
    } else {
      //different query
      return dispatch(searchArticles(query, pageNum));
    }
  }
}
