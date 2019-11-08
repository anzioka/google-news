import { RESULTS_PER_PAGE, MAX_RESULTS } from './constants';

//returns maximum number of pages of search results from a query
export function getMaxPages(totalResults) {
  const maxResults = Math.min(MAX_RESULTS, totalResults);
  return Math.ceil(maxResults/RESULTS_PER_PAGE);
}

//given two dates return the difference in minutes
export function diffMinutes(date1, date2) {
  var diff = (date2 - date1) / 1000;
  diff /= 60;
  return Math.abs(Math.ceil(diff));
}
