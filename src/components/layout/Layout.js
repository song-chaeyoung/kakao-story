import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import MobileSidebar from "./MobileSidebar";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const Gototop = styled.a`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fae100;
  color: #fff;
  font-size: 20px;
  position: fixed;
  bottom: 10%;
  right: 2%;
  /* padding-top: 5px; */
  opacity: 0;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
  &.active {
    opacity: 1;
    bottom: 20px;
  }
`;

const Layout = () => {
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

  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        {mobileSize ? <MobileSidebar /> : <Sidebar />}
        <Outlet />
      </ContentWrapper>
      <Gototop
        className="active"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa-solid fa-chevron-up"></i>
      </Gototop>
    </LayoutContainer>
  );
};

export default Layout;
