import React, { Component } from 'react';
import styled from 'styled-components';
import { MdMenu } from 'react-icons/md';
import { connect } from 'react-redux';
import { NEUTRALS, PRIMARY_SHADES } from '../theme/colors';
import { toggleSideNav } from '../redux/actions/actions';

const NavWrapper = styled.div`
  background-color: white;
  box-shadow: 0 3px 3px rgba(0,0,0,.29);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  padding: 0px 10px;
  min-height: 60px;
`
const ToggleSideViewWrapper = styled.div`
  color: ${NEUTRALS[1]};
  display: flex;
  align-items: center;
  margin-right: 40px;
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
class NavBar extends Component {
  render() {
    return (
      <NavWrapper>
        <ToggleSideViewWrapper onClick = {() => {this.props.dispatch(toggleSideNav())}}>
          <MdMenu size={24}/>
        </ToggleSideViewWrapper>
        <AppTitleWrapper>
            News Headlines
        </AppTitleWrapper>
      </NavWrapper>
    )
  }
}
export default connect()(NavBar);
