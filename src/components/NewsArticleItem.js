import React, { Component } from 'react';
import styled from 'styled-components';
import { NEUTRALS, PRIMARY_SHADES, GREEN} from '../theme/colors';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-family: 'Open Sans', sans-serif;
  border: 1px solid ${NEUTRALS[4]};
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px;
  :hover {
    background-color: ${NEUTRALS[7]}
  }
`
const RightContent = styled.div`
  width: 120px;
  flex-direction: column
`
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 100px;
  align-items: flex-start;
`
const ImageWrapper = styled.img`
  width: 100%;
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

`
const SourceAndTimeStamp = styled.div`
  display: flex;
  flex-direction: row;
  color: ${NEUTRALS[0]};
  font-size: 14px;
`
const ViewMoreButton = styled.button`
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
            <ArticleTitle>
              {item.title}
            </ArticleTitle>

            <SourceAndTimeStamp>
              {item.source.name}

            </SourceAndTimeStamp>
          </ArticleMetaData>
          <ViewMoreButton onClick = {this.goToArticleSource}>
            Read More
          </ViewMoreButton>
        </LeftContent>
        <RightContent>
          <img src={item.urlToImage} style={{maxWidth: '100%', height: 'auto', borderRadius: '5px'}}/>
        </RightContent>
      </OuterWrapper>
    )
  }
}

export default NewsArticleItem;
