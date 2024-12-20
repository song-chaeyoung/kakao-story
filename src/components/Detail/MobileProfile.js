import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ProfileFriend from "./ProfileFriend";
import { DarkModeStateContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../../configs/firebase";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";
import EditProfile from "./EditProfile";
import MobilePostForm from "../Main/MobilePostForm";
import { db } from "../../configs/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  /* height: 100%; */
  min-height: 100vh;
  height: 100%;
  padding: 0 10px 100px;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bgSubColor};

  video {
    width: 100%;
    height: 100%;
  }
`;

const MainProfile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .background {
    width: 1000px;
    height: 1000px;
    position: absolute;
    top: -770px;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
      z-index: 10;
    }
  }
  .profileCircle {
    margin-top: 120px;
    width: 200px;
    height: 200px;
    background: #d9d9d9;
    border: 2px solid #fff;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    z-index: 2;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .profile {
    text-align: center;
    .profile_name {
      font-size: 30px;
      font-weight: 700;
      color: ${({ theme }) => theme.fontColor};
    }
    .profile_desc {
      padding: 0 30px;
      margin: 8px 0;
      /* color: #666; */
      color: ${({ darkmode }) => (darkmode ? "#eee" : "#666")};
    }
  }
  .btngroup {
    display: flex;
    gap: 20px;
    > button {
      font-size: 14px;
      width: 150px;
      height: 34px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      &:nth-child(1) {
        background: #eee;
      }
      &:nth-child(2) {
        background: var(--point-color);
      }
    }
  }
`;

const PostFormWrapper = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
`;

const MobileProfile = ({ userInfo, setUserInfo }) => {
  const user = userAuth.currentUser;
  const { darkmode } = useContext(DarkModeStateContext);
  const { setUser } = useContext(userKakaoCredentials);
  const [modal, setModal] = useState(false);
  const [post, setPost] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      try {
        const postQuery = query(
          collection(db, "contents"),
          where("postId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(postQuery);

        if (snapshot.empty) {
          // console.log("게시물이 없습니다.");
          return;
        }

        const unsubscribe = onSnapshot(postQuery, (snapshot) => {
          const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPost(posts);
        });

        return () => {
          unsubscribe && unsubscribe();
        };
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Wrapper>
        <MainProfile darkmode={darkmode}>
          <div className="background">
            <img src={userInfo.bgImg || null} />
          </div>
          <div className="profileCircle">
            <img
              src={
                userInfo.userPhoto ||
                "https://blog.kakaocdn.net/dn/Knpew/btrt3QWFcFi/AAHlfhBm8ZWxWTYeA2KAV0/%EC%B9%B4%ED%86%A1%20%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84%20%EC%82%AC%EC%A7%84.jpg?attach=1&knm=img.jpg"
              }
            />
          </div>
          <div className="profile">
            <div className="profile_name">{userInfo.name}</div>
            <div className="profile_desc">{userInfo.userBio}</div>
          </div>
          <div className="btngroup">
            <button onClick={logoutEvent}>로그아웃</button>
            <button onClick={handleModal}>내 정보 수정</button>
          </div>
        </MainProfile>
        <ProfileFriend />
        <PostFormWrapper>
          {post.map((postData) => (
            <MobilePostForm key={postData.id} postData={postData} />
          ))}
        </PostFormWrapper>
      </Wrapper>
      {modal && (
        <EditProfile
          modalOff={handleModal}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}
    </>
  );
};

export default MobileProfile;
