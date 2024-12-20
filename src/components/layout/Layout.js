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
    </LayoutContainer>
  );
};

export default Layout;
