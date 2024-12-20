import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DarkModeStateContext } from "../../App";
import AddStoryHeader from "./AddStoryHeader";

const Wrapper = styled.main`
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.bgColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: fixed;
  z-index: 100;
  .header_left {
    display: flex;
    align-items: center;
  }
`;

const KakaoLogo = styled.div`
  width: 180px;
  height: 70px;
  cursor: pointer;
  background: ${({ darkmode }) =>
    darkmode
      ? `url("/kakaoLgo/kakaoDark.png") no-repeat`
      : `url("/kakaoLgo/kakaoLight.png") no-repeat`};
  cursor: pointer;
  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    background: url("/kakaolgo/kakaologos.png") no-repeat;
    object-fit: cover;
    margin-left: 10px;
    margin-bottom: 0;
  }
`;

const LeftIconHeader = styled.div`
  display: flex;
  gap: 15px;
  button {
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
    i {
      font-size: 26px;
      color: ${({ theme }) => theme.fontColor};
      opacity: 0.7;
    }
    .profile_circle {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--point-color);
      top: -2px;
      right: -2px;
    }
  }
`;
const HeaderCenter = styled.button`
  width: 450px;
  height: 35px;
  border: none;
  border-radius: 40px;
  font-size: 0.8rem;
  background: ${({ theme }) => theme.bgSubColor};
  color: ${({ theme }) => theme.fontColor};

  cursor: pointer;
  @media screen and (max-width: 1760px) {
    margin-right: 150px;
  }
  @media screen and (max-width: 1080px) {
    left: 55%;
    width: 350px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [writeMode, setWriteMode] = useState(false);
  const { darkmode } = useContext(DarkModeStateContext);
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

  const alertShow = () => {
    alert("준비 중인 서비스 입니다.");
  };

  return (
    <Wrapper>
      <div className="header_left">
        <KakaoLogo darkmode={darkmode} onClick={() => navigate("/")} />
        {/* <SearchBarHeader
          type="text"
          id="searchBarHeader"
          text={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <SearchBarHeaderValue>
          <i className="fa-solid fa-magnifying-glass"></i>검색
        </SearchBarHeaderValue> */}
      </div>
      <HeaderCenter onClick={() => setWriteMode((prev) => !prev)}>
        오늘의 스토리를 들려주세요.
      </HeaderCenter>
      {writeMode && <AddStoryHeader setWriteMode={setWriteMode} />}
      <LeftIconHeader>
        {/* <button onClick={alertShow}>
          <i className="fa-solid fa-user-group"></i>
        </button>
        <button onClick={alertShow}>
          <i className="fa-regular fa-bell"></i>
        </button> */}
        <button>
          <i
            className="fa-regular fa-circle-user"
            onClick={() => navigate("/profile")}
          ></i>
          <div className="profile_circle"></div>
        </button>
      </LeftIconHeader>
    </Wrapper>
  );
};
export default Header;
