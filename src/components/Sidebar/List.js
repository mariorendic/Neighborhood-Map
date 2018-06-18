import styled from "styled-components";

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ListItem = styled.li`
  padding: 10px 15px;
  color: #000;
  background: #9e9e9e91;
  border-radius: 3px;
  margin-bottom: 6px;
  transition: all 0.5s;

  &:hover {
    background: #7dcdcd;
    cursor: pointer;
    color: #3f5468;
  }
`;
