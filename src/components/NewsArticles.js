import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { categories, searchArticlesIfNeeded } from '../redux/actions/actions';
import { INITIAL_SEARCH, HEADLINES_DISPLAY } from '../redux/constants';
import NewsArticleItem from './NewsArticleItem';
import Spinner from './spinner';

const CategoryLabelWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  font-size: 26px;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: #202124;
`
const CategoryIconCircle = styled.div`
  height: 60px;
  width: 60px;
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
        <Icon size={40} />
    </CategoryIconCircle>
    {label}
  </CategoryLabelWrapper>
)

class NewsArticles extends Component {
  componentDidMount() {
    // console.log(match.url);
    // if (match.url = "/news/search") {
    //   const searchStr = location.search.split("=")[1];
    //  console.log(searchStr);
    //   // dispatch(searchArticlesIfNeeded(searchStr));
    // }

  }
  componentDidUpdate(prevProp) {
    //console.log(this.props );
    const {location, dispatch } = this.props;
    if (prevProp.location !== location) {
      if (location.pathname === "/news/search") {
        const str = location.search.split("=")[1];
        dispatch(searchArticlesIfNeeded(str, INITIAL_SEARCH));
      }
    }
  }
  render() {
    //todo: show error message if there is one
    const { category, articles, error, displayType } = this.props;
    console.log(articles);

    if (error != null) {
      console.log(error);
      //display nice error message
    }
    if (!articles || articles.isFetching) {
      return (
        <Spinner />
      )
    }
    //handle search now?

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
  }
}
export default connect(mapStateToProps)(NewsArticles);
