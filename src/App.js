import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
  updateDimensions() {
    console.log("width", window.innerWidth);
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.udpateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize');
  }
  render() {
    const { sideNavVisible }  = this.props;
    return (
      <Router>
        <AppWrapper>
          <NavBar/>
          <AppInnerWrapper sideNavVisible = {sideNavVisible}>
            <SideNavigation/>
            <MainContent />
          </AppInnerWrapper>
        </AppWrapper>
      </Router>
    );
  }
}

export default connect(store => ({
  sideNavVisible : store.sideNavVisible
}))(App);
