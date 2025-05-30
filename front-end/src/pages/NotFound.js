import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../components/GlobalStyle";

const Wrapper = styled.div`
  margin-top: 80px;
  min-height: 83vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
`;
const Code = styled.div`
  font-size: 1rem;
  color: #4d5a1f;
  margin-bottom: 16px;
  letter-spacing: 4px;
  font-weight: 500;
`;
const Message = styled.div`
  font-family: 'Nunito Sans', sans-serif;
  color: #81893f;
  font-size: 1.1rem;
  margin-bottom: 32px;
`;
const Button = styled.button`
  font-family: 'Montserrat', sans-serif;
  background: #6d8821;
  color: #fff;
  border: none;
  padding: 15px 45px;
  font-weight: 500;
  letter-spacing: 2px;
  cursor: pointer;
  transition: background 0.5s;
  &:hover {
    color: #6d8821;
    background: transparent;
    border: 1px solid #6d8821;
  }
`;

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Code>404</Code>
        <Message>Oops, seems like this page is no longer valid!</Message>
        <Button onClick={() => navigate("/")}>BACK TO HOMEPAGE</Button>
      </Wrapper>
    </>
  );
};

export default NotFound;
