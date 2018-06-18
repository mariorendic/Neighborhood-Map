import styled from "styled-components";

export const Button = styled.button`
    width: calc(50% - 10px);
    font-size: 16px;
    padding: 5px 15px;
    background: transparent;
    border: 1px solid #1c1c33;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: all 0.5s;
    margin: 5px;

  &:hover {
    cursor: pointer;
    background: #ffcd4c;
    color: #3f5468;
  }
`;
