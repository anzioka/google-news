import React, { Component } from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';
const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 5px;
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
  transition: all ease 1s;
  :active,
  :hover {
    background-color: rgba(255,255,255,0.8);
    border-color: rgba(0,0,0,0.25);
  }
`
const RightContent = styled.div`
  width: 120px;
  min-width: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-start;
`

const ArticleMetaData = styled.div`
  display: flex;
  flex-direction: column;
`
const ArticleTitle = styled.h4`
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  font-family: 'Lato', sans-serif;
  margin-bottom: 10px;
  text-decoration: none;
  cursor: pointer;
  color: #212529;
`
const SourceAndTimeStamp = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  color: ${NEUTRALS[0]};
  font-size: 14px;
  margin-bottom: 20px;
`

const TimeStamp = styled.p`
  margin: 0px;
  margin-right: 10px;
  padding: 0;
`
const NewsSource = styled.h6`
  font-size: 14px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: ${PRIMARY_SHADES[0]};
`
class NewsArticleItem extends Component {
  goToArticleSource = () => {
    const { item } = this.props;
    console.log(item);
    window.open(item.url, "_blank");
  }
  render() {
    const { item } = this.props;
    return (
      <OuterWrapper>
        <LeftContent>
          <ArticleMetaData>
            <ArticleTitle onClick= {this.goToArticleSource}>
              {item.title}
            </ArticleTitle>

            <SourceAndTimeStamp>
              <TimeStamp> <Moment fromNow>{item.publishedAt}</Moment> </TimeStamp>
              <NewsSource onClick = {this.goToArticleSource}> {item.source.name} </NewsSource>
            </SourceAndTimeStamp>
          </ArticleMetaData>

        </LeftContent>
        {item.urlToImage !== null &&
          <RightContent>
            <img src={item.urlToImage} alt="" style={{maxWidth: '100%', height: 'auto', borderRadius: '5px'}}/>
          </RightContent>
        }
      </OuterWrapper>
    )
  }
}

export default NewsArticleItem;
