import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Switch, Route, withRouter } from 'react-router-dom';
import NewsArticles from './NewsArticles';
import ArticleDetails from './ArticleDetails';
import { fetchArticlesIfNeeded } from '../redux/actions/actions';

const MainContentWrapper = styled.div`
  padding: 10px;
  overflow: auto;
  height: 85vh;
  flex-grow: 1;
`
class MainContent extends Component {
  componentDidMount() {
    const { selectedCategory, history, dispatch } = this.props;
    history.push(`/news/${selectedCategory}`);
    dispatch(fetchArticlesIfNeeded(selectedCategory));
  }

  render() {
    const { articles, dispatch } = this.props;
    return (
      <MainContentWrapper>
          <Switch>
            <Route exact path="/news/:category" component = { NewsArticles } />
            <Route path="/news/:category/:id" component = {ArticleDetails} />
          </Switch>
      </MainContentWrapper>
    )
  }
}
const mapStateToProps = state => {
  return {
    selectedCategory: state.selectedCategory
  }
}
export default withRouter(connect(mapStateToProps)(MainContent));
