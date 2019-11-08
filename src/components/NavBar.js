import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import { connect } from 'react-redux';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';
import { toggleSideNav, selectCategory, setDisplayType } from '../redux/actions/actions';
import { SEARCH_DISPLAY } from '../redux/constants';
import Searchbar from './Searchbar';
import Button from './Button';
import SearchbarAndButton from './SearchbarAndButton';

const NavWrapper = styled.div`
  background-color: white;
  box-shadow: 0 3px 3px rgba(0,0,0,.29);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 0px 10px;
  min-height: 60px;
`
const ToggleSideViewWrapper = styled.div`
  color: ${NEUTRALS[1]};
  display: flex;
  align-items: center;
  margin-right: 30px;
  transition: all ease 0.5s;
  :hover{
    color: ${NEUTRALS[0]};
  }
`;

const AppTitleWrapper = styled.h6`
  font-size: 24px;
  font-weight: 500;
  padding: 0px;
  margin: 0px;
  color: ${PRIMARY_SHADES[0]}
`;
const NavBarItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const SearchbarContainer = styled(NavBarItem)`
  @media(max-width: 576px) {
    display: none;
  }
`

const SearchButton = styled(Button)`
  margin-left: 20px;
`
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: "",
      error: false
    }
  }

  handleChange = (e) => {
    this.setState({
      searchStr: e.target.value,
    })
  }

  handleSearch = () => {
    const { history, dispatch } = this.props;
    const { searchStr } = this.state;

    if (searchStr === "") {
      this.setState({
        error: true
      })
    } else {
      this.setState({
        error: false
      })
      dispatch(selectCategory(null));
      dispatch(setDisplayType(SEARCH_DISPLAY));
      history.push(`/news/search?q=${searchStr}`);
    }

    //clear the search bar
    this.setState({
      searchStr: ""
    })
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  render() {
    const { searchStr, error } = this.state;
    const { dispatch } = this.props;
    return (
      <NavWrapper>
        <NavBarItem>
          <ToggleSideViewWrapper onClick = {() => {dispatch(toggleSideNav())}}>
            <MdMenu size={24}/>
          </ToggleSideViewWrapper>
          <AppTitleWrapper>
              News
          </AppTitleWrapper>
        </NavBarItem>
        <SearchbarContainer>
          <Searchbar error = {error} value = {searchStr} onKeyUp = {this.handleKeyUp} placeholder="Enter text to search" onChange = {this.handleChange}/>
          <SearchButton onClick = {this.handleSearch}> Search News </SearchButton>
        </SearchbarContainer>
      </NavWrapper>
    )
  }
}
export default withRouter(connect()(NavBar));
