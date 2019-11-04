import fetch from 'cross-fetch';
import AppConfig from '../../config/AppConfig';
import {
  MdFlag,
  MdBusiness,
  MdHealing
} from 'react-icons/md';

import * as types from '../constants';

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

function requestSources() {
  return {
    type: types.REQUEST_SOURCES,
  }
}

function receiveSources(json) {
  return {
    type: types.RECEIVE_SOURCES,
    sources: json.sources.map(item => item.name)
  }
}

//fetch news sources
export function fetchSources() {
  return (dispatch, getState) => {
    dispatch(requestSources())
    return fetch(`${types.SOURCES_URL}apiKey=${AppConfig.NEWS_API}&language=${getState()['language']}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSources(json)))
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
function filterNewsBySources(articles, newsSources) {
  const target = articles.filter(item => newsSources.includes(item.source.name))
  return target;
}

//async function: fetch headlines
//need to modify this to fetch more: set page=?
function fetchArticles(category) {
  return (dispatch, getState) => {
    dispatch(requestArticles(category))
    return fetch(`${types.NEWS_URL}category=${category}&apiKey=${AppConfig.NEWS_API}&country=us`)
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
