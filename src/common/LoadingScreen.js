import React from "react";
import { PropagateLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  color: ${({ theme }) => theme.fontColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
`;
function LoadingScreen() {
  return (
    <Wrapper>
      <PropagateLoader color="#FFE900" />
      <h3>잠시만 기다려주세요.</h3>
    </Wrapper>
  );
}

export default LoadingScreen;
