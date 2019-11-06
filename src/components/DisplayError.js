import React from 'react';
import { LIGHT_RED } from '../theme/colors';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  color: #343a40;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  background-color: ${LIGHT_RED};

`
const DisplayError = ({ error }) => (
  <ErrorWrapper>
    {error}
  </ErrorWrapper>
)

export default DisplayError;
