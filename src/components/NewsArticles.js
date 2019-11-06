import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { categories, searchArticlesIfNeeded, fetchHeadlinesIfNeeded, setDisplayType, selectCategory } from '../redux/actions/actions';
import { INITIAL_SEARCH, HEADLINES_DISPLAY, SEARCH_DISPLAY, EXTRA_SEARCH } from '../redux/constants';
import NewsArticleItem from './NewsArticleItem';
import DisplayError from './DisplayError';
import Spinner from './spinner';

const CategoryLabelWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  font-size: 26px;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: #202124;
`
const CategoryIconCircle = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 20px;
  display: flex;
  color: white;
  align-items: center;
  border: 1px solid GREEN;
  background-color: GREEN;
  justify-content: center;
`

const CategoryLabel = ({ label, icon: Icon }) => (
  <CategoryLabelWrapper>
    <CategoryIconCircle>
        <Icon size={30} />
    </CategoryIconCircle>
    {label}
  </CategoryLabelWrapper>
)

class NewsArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolledToBottom: false,
    }
  }
  loadPage = () => {
    const { location, dispatch, match } = this.props;
    if (location.pathname === "/news/search") {
      const str = location.search.split("=")[1];
      dispatch(setDisplayType(SEARCH_DISPLAY));
      dispatch(selectCategory(null));
      dispatch(searchArticlesIfNeeded(str, INITIAL_SEARCH));
    } else {
      const category = match.params.category;
      dispatch(setDisplayType(HEADLINES_DISPLAY));
      dispatch(selectCategory(category));
      dispatch(fetchHeadlinesIfNeeded(category, INITIAL_SEARCH));
    }
  }
  handleScroll = (e) => {
    const div = e.target;
    const scrolledToBottom = div.scrollTop + div.clientHeight === div.scrollHeight;
    // this.setState({
    //   scrolledToBottom: scrolledToBottom
    // });

    //want to fetch more data
    if (scrolledToBottom) {
      // this.setState({
      //   scrolledToBottom: true
      // })
      const { location, articles, match, dispatch } = this.props;
      if (location.pathname === "/news/search") {
        dispatch(searchArticlesIfNeeded(articles.query, EXTRA_SEARCH))
      } else{
        dispatch(fetchHeadlinesIfNeeded(match.params.category, EXTRA_SEARCH))
      }
    }

  }
  componentDidMount() {
    //detect on scrolling to the bottom
    document.querySelector("#main_content").addEventListener('scroll', this.handleScroll);
    this.loadPage();

  }
  componentWillUnmount() {
    document.querySelector("#main_content").removeEventListener('scroll', this.handleScroll);

  }
  componentDidUpdate(prevProps) {
    //console.log(this.props );
    const {location} = this.props;
    if (prevProps.location !== location) {
      this.loadPage();
    }
  }
  render() {
    //todo: show error message if there is one
    const { category, articles, error, displayType } = this.props;
    const hasMore = articles && articles.pageNum < articles.maxPages;
    const { scrolledToBottom } = this.state;

    //display error resulting from fetch request
    if (error != null) {
      return (
          <DisplayError error = {error} />
      )
    }

    //display error when no articles were matched.
    if ( articles && articles.items.length === 0 && !articles.isFetching) {
      let errorMessage =  "Sorry, but we are currently unable to fetch articles of category " + category + ". Please try again later.";
      if (displayType === SEARCH_DISPLAY) {
        errorMessage = "Your search \"" + articles.query + "\" did not match any articles. Make sure all the words are spelled correctly.";
      }
      return (
        <DisplayError error = {errorMessage} />
      )
    }

    if (!articles || articles.isFetching) {
      return (
        <Spinner />
      )
    }

    return (
      <div>
        {
          displayType === HEADLINES_DISPLAY && <CategoryLabel icon = {category.icon} label = {category.label}/>
        }

        {
          articles.items.map((item, index) => (
            <NewsArticleItem key = {index} item = {item} />
          ))
        }

        { hasMore &&
          scrolledToBottom &&
          <div style={{height: '50px', width: '100%'}}>
            <Spinner />
          </div>
        }
      </div>
    )
  }
}

function getCategory(selectedCategory) {
  const target = categories.filter((item) => item.value === selectedCategory)
  return target[0];
}

const mapStateToProps = state => {
  const { selectedCategory, articlesByCategory, displayType, error, query} = state;
  return {
    category: getCategory(selectedCategory),
    articles: displayType === HEADLINES_DISPLAY ? articlesByCategory[selectedCategory] : query,
    displayType: displayType,
    error: error
    // hasMore: articles.pageNum < articles.maxPages
  }
}
export default connect(mapStateToProps)(NewsArticles);
