import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { storage, userAuth } from "../../configs/firebase";
import { query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(3px);
  z-index: 300;
  cursor: pointer;
`;

const Modal = styled.div`
  width: 700px;
  height: 700px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.bgColor};
  border-radius: 30px;
  font-family: var(--kakao-small-regular);
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  .profile {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${({ theme }) => theme.fontColor};
    h2 {
      font-size: 20px;
      letter-spacing: -1px;
      font-family: var(--kakao-small-bold);
    }
    .profileEdit {
      width: 100%;
      height: 100px;
      /* background: #eee; */
      background: ${({ theme }) => theme.bgSubColor};

      margin: 0 auto;
      border-radius: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 30px;
      .user {
        display: flex;
        gap: 10px;
        align-items: center;
        .profileCiecle {
          width: 80px;
          height: 80px;
          background: #d9d9d9;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 2;
            object-fit: cover;
          }
        }
        .userInfo {
          p:nth-child(1) {
            font-size: 18px;
            /* color: #333; */
            color: ${({ theme }) => theme.fontColor};
            margin-bottom: 6px;
            height: 22px;
          }
          p:nth-child(2) {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 14px;
            color: #aaa;
            width: 220px;
            height: 34px;
            line-height: 120%;
            overflow: hidden;
            text-overflow: ellipsis;
            color: ${({ theme }) => theme.fontColor};
          }
        }
      }
      .inputGroup {
        display: flex;
        gap: 10px;
        > input[type="file"] {
          display: none;
        }
        > label {
          border: none;
          background: var(--point-color);
          padding: 8px 10px;
          height: fit-content;
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          &:nth-of-type(2) {
            background: #999;
          }
        }
      }
    }

    .infoitem {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      .icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* font-size: 26px; */
        color: #aaa;
        span {
          font-size: 28px;
        }
        i {
          font-size: 20px;
        }
      }
      input[type="text"],
      input[type="date"],
      select {
        color: ${({ theme }) => theme.fontColor};
        background: transparent;
        width: 100%;
        border: none;
        padding: 6px;
        border-bottom: 2px solid #d9d9d9;
        font-family: var(--kakao-small-regular);
        font-size: 16px;
        cursor: pointer;
        &::placeholder {
          opacity: 1;
          transition: all 0.3s;
        }
        &:focus {
          outline: none;
          border-bottom: 2px solid var(--point-color);
          &::placeholder {
            opacity: 0;
          }
        }
      }
    }
    .basicinfo,
    .kakaoinfo {
      display: flex;
      flex-direction: column;
      h3 {
        font-size: 18px;
        letter-spacing: -0.32px;
        color: ${({ theme }) => theme.fontColor};
      }
      > p {
        font-size: 12px;
        color: #aaa;
        letter-spacing: -0.24px;
      }
    }
    .profileThumbsup {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .profileThumbsup_text {
        width: 500px;
        h3 {
          font-size: 18px;
          letter-spacing: -0.32px;
        }
        p {
          font-size: 12px;
          color: #aaa;
          letter-spacing: -0.24px;
        }
      }
      .switch {
        width: 50px;
        height: 30px;
        background-color: #ccc;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-radius: 30px;
        padding: 3px;
        cursor: pointer;
      }
      .switch[data-ison="true"] {
        justify-content: flex-end;
        background: var(--point-color);
      }
      .handle {
        width: 26px;
        height: 26px;
        background-color: white;
        border-radius: 50%;
      }
    }
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    padding: 30px 15px;
    gap: 0;
    .profile {
      width: 100%;
      height: 80%;
      margin: auto 0;
      justify-content: center;
      gap: 30px;
      .profileEdit {
        height: fit-content;
        padding: 10px;
        border-radius: 50px;
        flex-direction: column;
        gap: 10px;
        .user {
          .userInfo {
            p:nth-child(1) {
              font-size: 16px;
              height: fit-content;
            }
            p:nth-child(2) {
              font-size: 12px;
              height: fit-content;
              height: 28px;
            }
          }
        }
        .inputGroup {
          > label {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      }
      .infoitem {
        .icon {
          width: 20px;
          height: 20px;
          span {
            font-size: 24px;
          }
          i {
            font-size: 16px;
          }
        }
        input[type="text"],
        input[type="date"],
        select {
          font-size: 14px;
        }
      }
      .basicinfo,
      .kakaoinfo {
        h3 {
          color: ${({ theme }) => theme.fontColor};
          font-size: 16px;
        }
        > p {
          font-size: 10px;
        }
      }
      .profileThumbsup {
        .profileThumbsup_text {
          width: 80%;
          h3 {
            color: ${({ theme }) => theme.fontColor};
            font-size: 16px;
          }
          p {
            font-size: 10px;
          }
        }
      }
    }
  }
`;

const SumbmitBtn = styled.button`
  font-size: 20px;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 80px;
  cursor: pointer;
  &.okSumbit {
    background: var(--point-color);
  }
  &.unSubmit {
    background: #ccc;
  }
  @media screen and (max-width: 768px) {
    padding: 8px 50px;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
  opacity: ${({ theme }) => theme.modeOpacity};
  > button:nth-child(1) {
    font-size: 20px;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 80px;
    cursor: pointer;
    background: #999;
  }
  @media screen and (max-width: 768px) {
    > button:nth-child(1) {
      padding: 8px 50px;
    }
  }
`;

const EditProfile = ({
  modalOff,
  userInfo,
  setUserInfo,
  isLoading,
  setIsLoading,
}) => {
  const user = userAuth.currentUser;
  const [changeContent, setChangeContent] = useState(false);
  const [isOn, setIsOn] = useState(userInfo.displayProfile);
  const [mobileSize, setMobileSize] = useState(false);

  const [originInfo, setOriginInfo] = useState({
    name: userInfo.name,
    userPhoto: userInfo.userPhoto,
    bgImg: userInfo.bgImg,
    userBio: userInfo.userBio,
    gender: userInfo.gender,
    birthday: userInfo.birthday,
    displayProfile: userInfo.displayProfile,
  });

  const [profileState, setProfileState] = useState({
    name: userInfo.name,
    userPhoto: userInfo.userPhoto,
    bgImg: userInfo.bgImg,
    userBio: userInfo.userBio,
    gender: userInfo.gender,
    birthday: userInfo.birthday,
    displayProfile: userInfo.displayProfile,
  });

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setProfileState((prev) => ({
      ...prev,
      displayProfile: !prev.displayProfile,
    }));
  };

  const wrapperClick = () => {
    modalOff();
  };

  const compareItem = async (newValue) => {
    const hasChanged = Object.keys(profileState).some(
      (key) => profileState[key] !== originInfo[key]
    );
    setChangeContent(hasChanged);
  };

  useEffect(() => {
    compareItem();
  }, [profileState]);

  const updatePhoto = async (e) => {
    const { files } = e.target;

    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `userImg/profileImg/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const profileUrl = await getDownloadURL(result.ref);

      setProfileState((or) => ({
        ...or,
        userPhoto: profileUrl,
      }));
    }
  };

  const updateBgPhoto = async (e) => {
    const { files } = e.target;

    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `userImg/bgImg/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const profileUrl = await getDownloadURL(result.ref);

      setProfileState((or) => ({
        ...or,
        bgImg: profileUrl,
      }));
    }
  };

  const editProfile = () => {
    if (!user) return;

    setIsLoading(true);

    setUserInfo((it) => ({
      name: profileState.name,
      userPhoto: profileState.userPhoto,
      bgImg: profileState.bgImg,
      userBio: profileState.userBio,
      gender: profileState.gender,
      birthday: profileState.birthday,
      displayProfile: profileState.displayProfile,
      createdAt: new Date(),
      usesId: user.uid,
    }));

    modalOff();
  };

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
    <>
      <Wrapper onClick={wrapperClick}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <div className="profile">
            <h2>프로필 편집</h2>
            <div className="profileEdit">
              <div className="user">
                <div className="profileCiecle">
                  <img
                    src={
                      profileState.userPhoto ||
                      "https://blog.kakaocdn.net/dn/Knpew/btrt3QWFcFi/AAHlfhBm8ZWxWTYeA2KAV0/%EC%B9%B4%ED%86%A1%20%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84%20%EC%82%AC%EC%A7%84.jpg?attach=1&knm=img.jpg"
                    }
                  />
                </div>
                <div className="userInfo">
                  <p>{userInfo.name}</p>
                  <p>{userInfo.userBio}</p>
                </div>
              </div>
              <div className="inputGroup">
                <input
                  type="file"
                  id="filetype"
                  accept="image/*"
                  onChange={updatePhoto}
                />
                <label htmlFor="filetype">사진변경</label>
                <input
                  type="file"
                  id="filetype_bg"
                  accept="image/*"
                  onChange={updateBgPhoto}
                />
                <label htmlFor="filetype_bg">배경사진변경</label>
              </div>
            </div>
            <div className="basicinfo">
              <h3>기본정보</h3>
              <div className="infoitem">
                <div className="icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <input
                  type="text"
                  value={profileState.name || ""}
                  onChange={(e) => {
                    setProfileState((or) => ({
                      ...or,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="infoitem">
                <div className="icon">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </div>
                <input
                  type="text"
                  value={profileState.userBio || ""}
                  placeholder="+ 한줄소개 추가"
                  onChange={(e) =>
                    setProfileState((or) => ({
                      ...or,
                      userBio: e.target.value,
                    }))
                  }
                ></input>
              </div>
            </div>
            <div className="kakaoinfo">
              <h3>카카오 내정보</h3>
              <p>
                카카오 계정 내정보에서 프로필 기본 정보를 통합 관리할 수 있으며,
                이 정보는 다른 카카오 서비스에서도 함께 이용할 수 있습니다.
              </p>
              <div className="infoitem">
                <div className="icon">
                  <span className="material-symbols-outlined">redeem</span>
                </div>
                <input
                  type="date"
                  value={profileState.birthday || ""}
                  onChange={(e) =>
                    setProfileState((or) => ({
                      ...or,
                      birthday: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="infoitem">
                <div className="icon">
                  <i className="fa-solid fa-venus-mars"></i>
                </div>
                <select
                  defaultValue={profileState.gender}
                  // value={profileState.gender}
                  onChange={(e) =>
                    setProfileState((or) => ({
                      ...or,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="noSelect" disabled>
                    성별을 선택해주세요
                  </option>
                  <option value={""}>선택안함</option>
                  <option value={"man"}>남성</option>
                  <option value={"woman"}>여성</option>
                </select>
              </div>
            </div>
            <div className="profileThumbsup">
              <div className="profileThumbsup_text">
                <h3>프로필에 계정 추천 표시</h3>
                <p>
                  사람들이 회원님의 프로필에서 비슷한 계정 추천을 볼 수 있는지와
                  회원님의 계정이 다른 프로필에서 추천될 수 있는지를 선택하세요.
                </p>
              </div>
              <div
                // profileState={profileState.displayProfile}
                className="switch"
                data-ison={isOn}
                onClick={toggleSwitch}
              >
                <motion.div className="handle" layout transition={spring} />
              </div>
            </div>
          </div>
          <BtnGroup>
            <button onClick={wrapperClick}>취소</button>
            {changeContent ? (
              <SumbmitBtn onClick={editProfile} className="okSumbit">
                {isLoading ? "업로드 중 ..." : "수정"}
              </SumbmitBtn>
            ) : (
              <SumbmitBtn className="unSumbit">수정</SumbmitBtn>
            )}
          </BtnGroup>
        </Modal>
      </Wrapper>
    </>
  );
};

export default EditProfile;
