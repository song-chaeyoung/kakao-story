import React, { Component, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import MobileModal from "../../components/Detail/DetailModal/MobileModal";
import MobilePostForm from "./MobilePostForm";
import { AnimatePresence, motion } from "framer-motion";
import { DarkModeStateContext } from "../../App";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";

const Wrapper = styled.div`
  margin: 20px auto 120px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.bgSubColor};
  position: relative;
`;

const Container = styled.div`
  width: 390px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;
`;

const ContentBox = styled.div`
  width: 370px;
  height: 420px;
  overflow: hidden;
  border-radius: 15px;
  color: ${({ theme }) => theme.fontColor};
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
`;

// 모달
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const StoryArray = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
  { id: 5, name: "Eve" },
  { id: 6, name: "Frank" },
  { id: 7, name: "Grace" },
  { id: 8, name: "Hannah" },
  { id: 9, name: "Ian" },
  { id: 10, name: "Jack" },
  { id: 11, name: "Kathy" },
  { id: 12, name: "Leo" },
  { id: 13, name: "Mona" },
  { id: 14, name: "Nina" },
  { id: 15, name: "Oscar" },
  { id: 16, name: "Paul" },
  { id: 17, name: "Quinn" },
  { id: 18, name: "Rachel" },
  { id: 19, name: "Steve" },
  { id: 20, name: "Tina" },
];

const StoryListMainMobile = styled(motion.div)`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 20px 5px 0 5px;
`;
const StoryMainMobile = styled.div`
  width: 50px;
  height: 90px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 10px;
  padding-left: 10px;
`;
const StoryImgMobile = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 1.8px solid #fae100;
  border-radius: 50%;
  cursor: pointer;
`;
const SotryDescMobile = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.fontColor};
  padding-top: none;
  padding-left: 3px;
  text-align: center;
`;

const Shorts = styled(motion.div)`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ShortsLogo = styled.div`
  width: 100px;
  height: 30px;
  background: ${({ isDarkMode }) =>
    isDarkMode
      ? `url("/kakaoLgo/shortsDark.png")`
      : `url("/kakaoLgo/shortsLight.png")`};
  cursor: pointer;
`;
const ShortsContent = styled(motion.div)`
  width: 100000px;
  display: flex;
  gap: 20px;
`;

const ShortsVideo = styled.video`
  width: 200px;
  height: 300px;
  background: #d9d9d9;
  border-radius: 15px;
  object-fit: cover;
  cursor: pointer;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 모달이 위에 오도록 */
`;

const Box = styled(motion.div)`
  position: absolute;
  width: 500px;
`;

const Gototop = styled.a`
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fae100;
  color: #fff;
  font-size: 30px;
  text-align: center;
  line-height: 50px;
  position: fixed;
  top: 85%;
  right: 10px;
  opacity: 0;
  transition: all 0.3s;
  z-index: 100;
  &.active {
    opacity: 1;
    bottom: 20px;
  }
`;

const TestBox = styled(motion.div)`
  position: absolute;
  width: 500px;
  height: 700px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobilePostCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [post, setPost] = useState([]);
  const { user } = useContext(userKakaoCredentials);
  const userLogin = user.isLoggedIn;

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!userLogin) {
      const popularQuery = query(
        collection(db, "popularPosts"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(popularQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        setPost(postsData);
      });

      return () => unsubscribe();
    } else {
      const postsQuery = query(
        collection(db, "contents"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPost(postsData);
      });

      return () => unsubscribe();
    }
  }, [userLogin]);

  return (
    <Wrapper>
      <Container>
        {post.map((item) => (
          <div key={item.id} onClick={() => openModal(item)}>
            <MobilePostForm postData={item} />
          </div>
        ))}
        <Gototop className="active" href="#">
          <i className="fa-solid fa-chevron-up"></i>
        </Gototop>
      </Container>

      <AnimatePresence onExitComplete={() => setSelectedPost(null)}>
        {isModalOpen && (
          <MobileModal
            isOpen={isModalOpen}
            onClose={closeModal}
            postId={selectedPost.id}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default MobilePostCard;
