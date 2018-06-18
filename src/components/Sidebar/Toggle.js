import styled from "styled-components";

export const Toggle = styled.button`
    padding: 5px 15px;
    background: url(img/bars.svg) center no-repeat;
    border: none;
    margin-bottom: 10px;
    border-radius: 8px;
    -webkit-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    margin: 5px;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;

  &:hover {
    cursor: pointer;
    color: #3f5468;
  }
`;
