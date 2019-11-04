import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { categories } from '../redux/actions/actions';
import { GREEN } from '../theme/colors';
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
  render() {
    const { category, articles } = this.props;
    if (!articles || articles.isFetching) {
      return (
        <Spinner />
      )
    }
    return (
      <div>
        <CategoryLabel icon = {category.icon} label = {category.label}/>
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
  const { selectedCategory, articlesByCategory } = state;

  // let items = articlesByCategory[selectedCategory];
  // items = items ? items['items'] : []
  return {
    category: getCategory(selectedCategory),
    articles: articlesByCategory[selectedCategory]
  }
}
export default connect(mapStateToProps)(NewsArticles);
