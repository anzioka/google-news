import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setScreenWidth } from './redux/actions/actions';
import {
  MainContent,
  SideNavigation,
  NavBar
}from './components';

const AppInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  margin: ${props => props.sideNavVisible ? `0px` : `0px 40px`};
`

const AppWrapper = styled.div`
  font-family: 'Roboto', 'Open Sans' sans-serif;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  cursor: default;
`
class App extends Component {
  componentDidMount() {
    // this.updateDimensions();
    const { dispatch } = this.props;
    window.addEventListener('resize', () => {
      dispatch(setScreenWidth())
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize');
  }
  render() {
    const { sideNavVisible, screenWidth }  = this.props;
    return (
      <Router>
        <AppWrapper>
          <NavBar/>
          <AppInnerWrapper sideNavVisible = {sideNavVisible}>
            { screenWidth > 992 && <SideNavigation/>}
            <MainContent />
          </AppInnerWrapper>
        </AppWrapper>
      </Router>
    );
  }
}

export default connect(store => ({
  sideNavVisible : store.sideNavVisible,
  screenWidth: store.screenWidth
}))(App);
