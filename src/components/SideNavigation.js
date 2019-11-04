import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { categories, selectCategory,fetchArticlesIfNeeded} from '../redux/actions/actions';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';

const NavigationWrapper = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  width: 250px;
  background-color: #f5f5f5;
  overflow-y:scroll;
  padding: 10px;
  border-right: 1px solid #eee;
`

const LinkWrapper = styled(Link)`
  font-weight: 400;
  text-decoration: none;
  color: ${ props => props.selected ? PRIMARY_SHADES[0] : NEUTRALS[0]};
  font-family: 'Roboto', sans-serif;
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  :active,
  :hover{
    color: ${PRIMARY_SHADES[0]};
  }

`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`
class NavItem extends Component {
  handleSelectCategory = () => {
    const { dispatch, item } = this.props;
    dispatch(selectCategory(item.value));
    dispatch(fetchArticlesIfNeeded(item.value));
  }
  render() {
    const {item, icon:Icon, selected, dispatch} = this.props;
    return (
      <LinkWrapper to = {`/news/${item.value}`} onClick = {this.handleSelectCategory} selected = {selected}>
          <IconWrapper>
            <Icon size = {24} />
          </IconWrapper>
          {item.label}
      </LinkWrapper>
    )
  }
}

class SideNavigation extends Component {
  render() {
    const { visible, selectedCategory, dispatch } = this.props;
    return (
      <NavigationWrapper visible = {visible}>
        {
          categories.map((item, index) => (
            <NavItem key={index} item={item} icon = {item.icon} selected = {item.value === selectedCategory} dispatch = {dispatch} />
          ))
        }
      </NavigationWrapper>
    )
  }
}


export default connect(store => ({
  visible: store.sideNavVisible,
  selectedCategory: store.selectedCategory
}))(SideNavigation);
