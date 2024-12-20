import React, { useContext, useState } from "react";
import styled from "styled-components";
import { mixins } from "../../styles/GlobalStyles.styles";
import { DarkModeStateContext } from "../../App";
import EditProfile from "./EditProfile";
import { userAuth } from "../../configs/firebase";
import { useNavigate } from "react-router-dom";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";

const Wrapper = styled.div`
  width: 300px;
  ${mixins.flex({
    direction: "column",
    justify: "center",
    align: "center",
    gap: "30",
  })};
  @media screen and (max-width: 1300px) {
    /* width: 100%; */
    width: calc(950px / 2);
    /* flex-direction: row; */
  }
`;

const MyProfile = styled.div`
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  border-radius: 20px;
  width: 100%;
  height: 510px;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.4);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  /* margin-top: 200px; */
  /* position: absolute;
  top: -100px;
  right: 0; */
  .profileImg {
    width: 220px;
    height: 220px;
    background: #ccc;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    svg {
      width: 60%;
      color: #fff;
    }
  }
  .profileInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    h5 {
      font-size: 32px;
    }
    p {
      color: ${({ darkmode }) => (darkmode ? "#ccc" : "#666")};
      font-size: 14px;
      text-align: center;
    }
  }
  @media screen and (max-width: 1300px) {
    height: fit-content;
    flex-direction: row;
    .profileImg {
      min-width: 180px;
      height: 180px;
      width: 180px;
    }
  }
`;

const Btns = styled.div`
  width: 100%;
  ${mixins.flex({
    direction: "column",
    justify: "center",
    align: "center",
    gap: "14",
  })};
  button {
    width: 100%;
    background: ${({ $darkmode }) => ($darkmode ? "#333" : "#ddd")};
    color: ${({ theme }) => theme.fontColor};
    border: none;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: -0.4px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      border-radius: 20px;
      opacity: 0.8;
    }
  }
  @media screen and (max-width: 1300px) {
    flex-direction: row;
    button {
      /* width: 200px; */
    }
  }
`;

const MyProfileInfo = ({ userInfo, setUserInfo, isLoading, setIsLoading }) => {
  const { darkmode } = useContext(DarkModeStateContext);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(userKakaoCredentials);

  const handleModal = () => {
    setModal((prev) => !prev);
  };

  const logoutEvent = async () => {
    const logout = window.confirm(
      `${userInfo.name}님의 계정에서 로그아웃 하시겠습니까?`
    );
    if (logout) {
      await userAuth.signOut();
      navigate("/");
      setUser((prev) => ({
        ...prev,
        isLoggedIn: false,
      }));
    }
  };

  return (
    <Wrapper>
      <MyProfile $darkmode={darkmode}>
        <div className="profileImg">
          <img
            src={
              userInfo.userPhoto ||
              "https://blog.kakaocdn.net/dn/Knpew/btrt3QWFcFi/AAHlfhBm8ZWxWTYeA2KAV0/%EC%B9%B4%ED%86%A1%20%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84%20%EC%82%AC%EC%A7%84.jpg?attach=1&knm=img.jpg"
            }
          />
        </div>
        <div className="profileInfo">
          <h5>{userInfo.name}</h5>
          <p>{userInfo.userBio}</p>
        </div>
      </MyProfile>
      <Btns $darkmode={darkmode}>
        <button onClick={handleModal}>내 정보 수정</button>
        <button onClick={logoutEvent}>로그아웃</button>
      </Btns>
      {modal && (
        <EditProfile
          modalOff={handleModal}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </Wrapper>
  );
};

export default MyProfileInfo;
