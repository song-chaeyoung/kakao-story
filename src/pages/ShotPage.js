import React from "react";
import styled from "styled-components";
import Video from "../components/Main/Video";
import VideoTest from "../components/Main/VideoTest";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  padding-left: 80px;
  padding-top: 60px;
  background: ${({ theme }) => theme.bgSubColor};
  color: ${({ theme }) => theme.fontColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShotPage = () => {
  return (
    <Container>
      <VideoTest />
    </Container>
  );
};

export default ShotPage;
