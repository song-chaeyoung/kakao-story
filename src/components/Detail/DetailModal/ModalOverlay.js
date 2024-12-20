import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000; // 모달보다 아래에 위치 모달은 z-index : 1001
`;

const ModalOverlay = ({ onClick }) => {
  return <Overlay onClick={onClick} />;
};

export default ModalOverlay;
