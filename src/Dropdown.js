import React from 'react';
import styled from 'styled-components';

const DropdownWrap = styled('div')`
  margin: 0 auto;
  width: 90%;
  max-width: 400px;
  border-radius: 5px;
  border: 1px solid #ccc;
  overflow: hidden;
  padding-right: 30px;
  background: white;
  position: relative;
  select {
    padding: 15px;
    border: none;
    width: 130%;
    box-shadow: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
    font-size: 16px;
  }
  select:focus {
    outline: none;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: hsl(205, 87%, 29%) transparent transparent transparent;
    pointer-events: none;
  }
`;

const Dropdown = ({ children }) => {
  return <DropdownWrap>{children}</DropdownWrap>;
};

export default Dropdown;
