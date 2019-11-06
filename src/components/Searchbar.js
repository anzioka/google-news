import React, { Component } from 'react';
import styled from 'styled-components';
import { PRIMARY_SHADES, NEUTRALS } from '../theme/colors';

const Input = styled.input`
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  padding: .25rem .25rem;
  border: 1px solid ${NEUTRALS[4]};
  transition: all ease .5s;
  :focus {
    outline: none;
    border: 1px solid ${PRIMARY_SHADES[0]};
  }
`
class Searchbar extends Component {
  render() {
    return (
      <Input {...this.props}/>
    )
  }
}
export default Searchbar;
