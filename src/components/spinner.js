import React from 'react';
import styled, { keyframes } from 'styled-components';
import { PRIMARY_SHADES, NEUTRALS } from '../theme/colors';

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

const SpinningCircle = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
  border: 2px solid ${NEUTRALS[4]};
  border-top-color: ${PRIMARY_SHADES[0]};
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Spinner = () => (
  <Wrapper>
    <SpinningCircle />
  </Wrapper>
)
export default Spinner;
