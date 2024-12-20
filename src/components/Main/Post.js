import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { userAuth } from "../../configs/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import EditModal from "../Detail/DetailModal/EditModal";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";
import Modal from "../Login/LoginModal/Modal";

const Container = styled.div`
  width: 950px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  transition: all 0.3s;
  margin-bottom: 40px;
  position: relative;
  background: ${({ theme }) =>
    theme.bgColor === "var(--main-dark)" ? "#333" : theme.bgColor};
  &:hover {
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  }
`;
const ContainerBox = styled.div`
  width: 900px;
  height: 350px;
  display: flex;
  gap: 53px;
`;

const Images = styled.div`
  width: 350px;
  height: 350px;
  background: #efefef;
  border-radius: 20px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  img {
    object-fit: cover;
  }
`;

const Text = styled.div`
  width: 500px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.div`
  width: 500px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 35px;
  gap: 35px;
`;

const Names = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const NameImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #efefef;
  background-image: url(${(props) => props.profileImage});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NameText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ isDarkMode, theme }) => (isDarkMode ? "#fff" : theme.fontColor)};
`;

const Day = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ isDarkMode, theme }) => (isDarkMode ? "#fff" : theme.fontColor)};
`;

const FormText = styled.div`
  width: 500px;
  height: 350px;
  padding-bottom: 33px;
  font-size: 16px;
  color: ${({ isDarkMode, theme }) => (isDarkMode ? "#fff" : theme.fontColor)};
`;

const Icons = styled.div`
  width: 500px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  font-size: 20px;
`;

const Icon = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
`;

const Heart = styled.i`
  color: #ccc;
  &:hover {
    color: #ffe900;
    cursor: pointer;
  }
`;

const IconText = styled.p`
  font-size: 14px;
  color: #ccc;
`;

const Commentt = styled.i`
  color: #ccc;
  &:hover {
    color: #ffe900;
    cursor: pointer;
  }
`;

const Plane = styled.i`
  color: #ccc;
  &:hover {
    color: #ffe900;
    cursor: pointer;
  }
`;

const Ellipsis = styled.i`
  color: #ccc;
  &:hover {
    color: #ffe900;
    cursor: pointer;
  }
`;

const Comments = styled.div`
  width: 500px;
  height: 50px;
  display: flex;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const CommentImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #efefef;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Commentinput = styled.input`
  width: 420px;
  height: 50px;
  background: ${({ theme }) => theme.bgInputColor};
  border-radius: 15px;
  border: none;
  color: black; /* 기본 색상 */
  text-shadow: none; /* 기본 텍스트 그림자 없음 */
  transition: color 0.2s ease; /* 색상 변화에 애니메이션 추가 */
  padding: 0 90px 0 20px;
  outline: none;
`;

const CommentIcon = styled.div`
  width: 450px;
  height: 50px;
  display: flex;
  gap: 10px;
  position: relative;
`;

const Llink = styled.i`
  position: absolute;
  top: 35%;
  right: 60px;
  color: #666;
  cursor: pointer;
`;

const Img = styled.i`
  position: absolute;
  top: 35%;
  right: 30px;
  color: #666;
  cursor: pointer;
`;
const Slider = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  bottom: 4%;
  left: 101%;
  transition: right 0.3s;
  z-index: 1;
  background: ${({ theme }) =>
    theme.bgColor === "var(--main-dark)" ? "#333" : theme.bgColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  gap: 10px;
`;

const Editbutton = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffe900;
  }
`;

const Deletebutton = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  background: ${({ theme }) =>
    theme.bgColor === "var(--main-dark)" ? "#333" : theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffe900;
  }
`;

const Post = ({ postData, openModal, isModalOpen, selectedPost }) => {
  const { user } = useContext(userKakaoCredentials);
  const userLogin = user.isLoggedIn;

  const nowUser = userAuth.currentUser;
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [userImg, setUserImg] = useState(null);
  const [writeName, setWriteName] = useState(null);
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [populerImg, setPopulerImg] = useState("");
  const [loginUser, setLoginUser] = useState(false);

  const {
    id,
    userName,
    post,
    photo,
    likes,
    postId,
    createdAt,
    comments,
    content,
    userId,
    userProfileImg,
    postImg,
  } = postData;

  useEffect(() => {
    if (!userLogin) {
      if (postImg) {
        setPopulerImg(postImg[0].url);
        return;
      }
    }
  }, []);

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(data);
    }
  };

  useEffect(() => {
    setUserImg(userData.userPhoto);
    setWriteName(userData.name);
  }, [userData]);

  useEffect(() => {
    if (postId) getUserInfo(postId);
  }, []);

  const toggleSlider = (e) => {
    e.stopPropagation();
    setSliderOpen((prev) => !prev);
  };

  const heartUp = async (e) => {
    e.stopPropagation();

    if (!userLogin) return;

    const postDocRef = doc(db, "contents", id);
    const postDoc = await getDoc(postDocRef);

    if (postDoc) {
      const data = postDoc.data();
      const currentLikes = data.likes || 0;
      await updateDoc(postDocRef, {
        ...data,
        likes: currentLikes + 1,
      });
    }
  };

  const editEvent = (e, id) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const deleteEvent = (e, id) => {
    e.stopPropagation();
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      deleteDoc(doc(db, "contents", id));
    }
  };

  const openProfileModal = () => {
    openModal(id);
  };

  const noLoginUser = (e) => {
    if (!userLogin) {
      e.stopPropagation();
      setLoginUser(true);
    }
  };

  useEffect(() => {
    if (userLogin) setLoginUser(false);
  }, [userLogin]);

  return (
    <div onClick={openProfileModal}>
      <Container>
        <ContainerBox>
          <Images>
            {
              <img
                src={userLogin ? photo : populerImg}
                alt="Post"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "20px",
                }}
              />
            }
          </Images>

          <Text>
            <Name>
              <Names>
                <NameImage>
                  <img
                    src={userLogin ? userImg || null : userProfileImg || null}
                  />
                </NameImage>
                <NameText>{userLogin ? writeName : userId}</NameText>
              </Names>
              <Day>{new Date(createdAt).toLocaleDateString()}</Day>
            </Name>

            <FormText>
              <p>{userLogin ? post : content}</p>
            </FormText>

            <Icons onClick={noLoginUser}>
              <Icon>
                <Heart onClick={heartUp} className="fa-solid fa-heart" />
                <IconText>{likes}</IconText>
                <Commentt className="fa-regular fa-comment" />
                <IconText>{comments.length}</IconText>
                <Plane className="fa-regular fa-paper-plane" />
              </Icon>

              {nowUser?.uid === postId && (
                <Ellipsis
                  className="fa-solid fa-ellipsis"
                  onClick={toggleSlider}
                />
              )}
            </Icons>
            <Comments onClick={noLoginUser}>
              <Comment>
                <CommentImage>
                  <img src={nowUser?.photoURL} />
                </CommentImage>

                <Commentinput type="text" placeholder="댓글 입력..." />
              </Comment>

              <CommentIcon>
                <Llink className="fa-solid fa-link" />

                <Img className="fa-regular fa-image" />
              </CommentIcon>
            </Comments>

            <Slider isOpen={isSliderOpen}>
              {/* <Editbutton onClick={(e) => editEvent(e, id)}>Edit</Editbutton> */}

              <Deletebutton onClick={(e) => deleteEvent(e, id)}>
                글 삭제
              </Deletebutton>
            </Slider>
          </Text>
        </ContainerBox>
      </Container>
      {editMode && <EditModal setEditMode={setEditMode} />}
      {loginUser && <Modal />}
    </div>
  );
};

export default Post;
