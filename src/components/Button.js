import styled from 'styled-components';
import { PRIMARY_SHADES } from '../theme/colors';

const Button = styled.button`
  background-color: ${PRIMARY_SHADES[0]};
  color: white;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-color: ${PRIMARY_SHADES[0]};
  border: 1px solid transparent;
  padding: .25rem .25rem;
  border-radius:.25rem;
  font-size: 1rem;
  line-height: 1.5;
  :active,
  :hover,
  :focus {
    outline: none;
    background-color:${PRIMARY_SHADES[1]};
  }
`

export default Button;
