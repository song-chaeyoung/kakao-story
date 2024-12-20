import React, { useEffect, useState } from "react";
// import User from "./User";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
// import Video from "./Video";
import { useLocation } from "react-router-dom"; // Import useLocation if needed
import PostList from "../components/Main/PostList";
import MobilePostList from "../components/Main/MobilePostList";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bgMainColor};
`;

const Container = styled.div`
  width: 1084px;
  background: #fff;
  background: ${({ theme }) =>
    theme.bgColor === "var(--main-dark)" ? "#222" : theme.bgColor};
  @media (max-width: 768px) {
    width: 100%; // 모바일에서 숨기기
  }
`;

// const Videomap = styled.div`
//   display: ${({ isMobile }) =>
//     isMobile ? "none" : "block"}; // Mobile일 때 숨기기
// `;

const MainPage = () => {
  const [mobileSize, setMobileSize] = useState(false);
  const updateSize = (e) => {
    if (e.target.innerWidth <= 768) setMobileSize(true);
    else setMobileSize(false);
  };

  useEffect(() => {
    window.innerWidth <= 768 ? setMobileSize(true) : setMobileSize(false);
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return <>{mobileSize ? <MobilePostList /> : <PostList />}</>;
};

export default MainPage;
