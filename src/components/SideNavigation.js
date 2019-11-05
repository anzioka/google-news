import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { categories, selectCategory,fetchArticlesIfNeeded, toggleSideNav} from '../redux/actions/actions';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';
import { BREAK_POINT } from '../redux/constants';

const NavigationWrapper = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  flex-shrink: 0;
  height: ${props => props.screenWidth <= BREAK_POINT ? '100%': 'auto'}
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
const Navigation = ({ visible, selectedCategory, dispatch, screenWidth}) => (
  <NavigationWrapper visible = {visible} screenWidth = {screenWidth}>
    {
      categories.map((item, index) => (
        <NavItem key={index} item={item} icon = {item.icon} selected = {item.value === selectedCategory} dispatch = {dispatch} />
      ))
    }
  </NavigationWrapper>
)
const SmallScreenWrapper = styled.div`
  left: 0;
  position: fixed;
  display: ${props => props.visible ? 'block' : 'none'};
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(0,0,0,0.5);
`

class SideNavigation extends Component {
  hideSideNavigation = () => {
    const { dispatch } = this.props;
    dispatch(toggleSideNav());
  }
  render() {
    const { visible, selectedCategory, dispatch, screenWidth } = this.props;
    if (screenWidth < BREAK_POINT) {
      return (
        <SmallScreenWrapper visible = {visible} onClick = {this.hideSideNavigation}>
          <Navigation {...this.props} />
        </SmallScreenWrapper>
      )
    } else{
      return (
        <Navigation {...this.props} />
      )
    }
  }
}


export default connect(store => ({
  visible: store.sideNavVisible,
  selectedCategory: store.selectedCategory,
  screenWidth: store.screenWidth
}))(SideNavigation);
