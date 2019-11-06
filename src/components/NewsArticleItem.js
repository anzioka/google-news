import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';
import Button from './Button';
const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${NEUTRALS[4]};
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px;
  :hover {
    background-color: ${NEUTRALS[7]}
    border-color: ${NEUTRALS[2]}
  }
`
const RightContent = styled.div`
  width: 120px;
  min-width: 100px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 100px;
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
  margin-bottom: 5px;
  text-decoration: none;
  cursor: pointer;
`
const SourceAndTimeStamp = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  color: ${NEUTRALS[0]};
  font-size: 14px;
  margin-bottom: 20px;
`
const ViewMoreButton = styled(Button)`
  background-color: ${PRIMARY_SHADES[0]};
  color: white;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-color: ${PRIMARY_SHADES[0]};
  border: 1px solid transparent;
  font-size: 1rem;
  line-height: 1.5;
  :active,
  :hover,
  :focus {
    outline: none;
    background-color:${PRIMARY_SHADES[1]}
  }
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
