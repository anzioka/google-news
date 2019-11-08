import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setScreenWidth } from './redux/actions/actions';
import { SIDENAV_OVERLAY_MAXWIDTH } from './utils/constants';
import {
  MainContent,
  SideNavigation,
  NavBar
}from './components';

const AppInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  margin: 0px;
`

const AppWrapper = styled.div`
  font-family: 'Roboto', 'Lato' sans-serif;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  cursor: default;
`

class App extends Component {
  constructor(props) {
    super(props);
    const { match, history} = props;
    if (match.path === "/") {
      history.push("/news/general");
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('resize', () => {
      dispatch(setScreenWidth())
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => {});
  }
  render() {
    const { sideNavVisible, screenWidth }  = this.props;
    return (
      <AppWrapper>
        <NavBar/>
        <AppInnerWrapper sideNavVisible = {sideNavVisible}>
          { screenWidth > SIDENAV_OVERLAY_MAXWIDTH && <SideNavigation/>}
          <MainContent />
        </AppInnerWrapper>
        { screenWidth <=  SIDENAV_OVERLAY_MAXWIDTH && <SideNavigation /> }
      </AppWrapper>
    );
  }
}

const mapStateToProps = store => {
  return {
    sideNavVisible : store.screenWidth <= SIDENAV_OVERLAY_MAXWIDTH ? false : store.sideNavVisible,
    screenWidth: store.screenWidth
  }
}

export default withRouter(connect(mapStateToProps)(App));
